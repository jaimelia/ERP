import {useState, useEffect, type FC} from "react";
import {apiUrl, fetchJsonWithAuth} from "../../api/common.ts";

interface CCE {
    id: number;
    nom: string;
    prenom: string;
    numeroCCE: string;
    statut: "Active" | "Désactivée";
    dateCreation: string;
    montantCredite: string;
}

type ModalType = "create" | "edit" | "credit" | "transactions" | "reedit_alert" | "reedit" | null;

export const CCEWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number | null>(null);
    const [cces, setCces] = useState<CCE[]>([]);

    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const loadCces = async () => {
        try {
            const data = await fetchJsonWithAuth(apiUrl("/cce"));
            const formattedData = data.map((item: any) => ({
                id: item.id,
                nom: item.nom,
                prenom: item.prenom,
                numeroCCE: `****${item.code}`,
                statut: (item.statut === "activated" || item.statut === "ACTIVATED") ? "Active" : "Désactivée",
                dateCreation: new Date(item.dateCreation).toLocaleDateString("fr-FR"),
                montantCredite: `${item.montantCredite.toFixed(2)}€`
            }));
            setCces(formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCces();
    }, []);

    const handleToggleStatus = async () => {
        if (!selected) return;
        try {
            await fetchJsonWithAuth(apiUrl(`/cce/${selected}/toggle-status`), { method: "PUT" });
            setCces(prev => prev.map(c => {
                if (c.id === selected) {
                    return { ...c, statut: c.statut === "Active" ? "Désactivée" : "Active" };
                }
                return c;
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (type: ModalType) => {
        setFormData({});
        setActiveModal(type);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setFormData({});
    };

    const handleValidateModal = async () => {
        if (activeModal === "reedit_alert") {
            setActiveModal("reedit");
            return;
        }

        try {
            let url = "";
            let method = "POST";

            switch (activeModal) {
                case "credit":
                    url = `/cce/${selected}/credit`;
                    method = "PUT";
                    break;
                case "create":
                    url = `/cce`;
                    break;
                case "edit":
                    url = `/cce/${selected}`;
                    method = "PUT";
                    break;
                case "reedit":
                    url = `/cce/${selected}/reedit`;
                    break;
            }

            if (url) {
                await fetchJsonWithAuth(apiUrl(url), {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                await loadCces();
                setSelected(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            handleCloseModal();
        }
    };

    const filtered = cces.filter(c =>
        `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        c.numeroCCE.includes(search)
    );

    const selectedCard = cces.find(c => c.id === selected);
    const toggleButtonText = selectedCard?.statut === "Active" ? "Désactiver" : "Activer";

    const renderModalContent = () => {
        switch (activeModal) {
            case "credit":
                return (
                    <>
                        <h3>Créditer la CCE</h3>
                        <div className="cce-modal-form">
                            <input
                                type="number"
                                placeholder="Montant à créditer (€)"
                                value={formData.amount || ""}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                            />
                        </div>
                    </>
                );
            case "create":
            case "reedit":
                return (
                    <>
                        <h3>{activeModal === "create" ? "Créer une CCE" : "Rééditer la CCE"}</h3>
                        <div className="cce-modal-form">
                            <input placeholder="Nom" onChange={e => setFormData({...formData, nom: e.target.value})} />
                            <input placeholder="Prénom" onChange={e => setFormData({...formData, prenom: e.target.value})} />
                            <input placeholder="Email" type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input placeholder="Téléphone" type="tel" onChange={e => setFormData({...formData, tel: e.target.value})} />
                            <input placeholder="Code (PIN)" maxLength={4} onChange={e => setFormData({...formData, code: e.target.value})} />
                            <input type="number" placeholder="Montant initial (€)" onChange={e => setFormData({...formData, montant: e.target.value})} />
                        </div>
                    </>
                );
            case "edit":
                return (
                    <>
                        <h3>Modifier la CCE</h3>
                        <div className="cce-modal-form">
                            <input placeholder="Nom" onChange={e => setFormData({...formData, nom: e.target.value})} />
                            <input placeholder="Prénom" onChange={e => setFormData({...formData, prenom: e.target.value})} />
                            <input placeholder="Email" type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input placeholder="Téléphone" type="tel" onChange={e => setFormData({...formData, tel: e.target.value})} />
                            <input placeholder="Nouveau code (PIN)" maxLength={4} onChange={e => setFormData({...formData, code: e.target.value})} />
                        </div>
                    </>
                );
            case "reedit_alert":
                return (
                    <>
                        <h3>Attention</h3>
                        <p style={{ marginBottom: "20px", color: "var(--color-text)", fontSize: "14px" }}>
                            Vous êtes sur le point de rééditer cette carte CCE. L'ancienne carte sera désactivée et une nouvelle sera créée. Voulez-vous continuer ?
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="widget-container">
            <div className="widget-toolbar">
                <div className="widget-search">
                    <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher CCE"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="widget-table-wrap">
                <table className="widget-table">
                    <thead>
                    <tr>
                        <th>NOM Prénom</th>
                        <th>N° CCE</th>
                        <th>Statut</th>
                        <th>Date création</th>
                        <th>Montant crédité</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(c => (
                        <tr
                            key={c.id}
                            onClick={() => setSelected(selected === c.id ? null : c.id)}
                            style={{cursor: "pointer", background: selected === c.id ? "var(--color-accent-soft)" : undefined}}
                        >
                            <td>{c.nom} {c.prenom}</td>
                            <td><span className="cce-masked">{c.numeroCCE}</span></td>
                            <td>
                                    <span className={`status-badge status-${c.statut === "Active" ? "active" : "desactivee"}`}>
                                        {c.statut}
                                    </span>
                            </td>
                            <td>{c.dateCreation}</td>
                            <td>{c.montantCredite}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="cce-actions">
                <button className="cce-action-btn" type="button" onClick={() => handleOpenModal("create")}>Créer</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenModal("edit")}>Modifier</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenModal("credit")}>Créditer</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={handleToggleStatus}>{toggleButtonText}</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenModal("transactions")}>Voir transactions</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenModal("reedit_alert")}>Rééditer</button>
            </div>

            {activeModal && (
                <div className="cce-modal-overlay">
                    <div className="cce-modal">
                        {renderModalContent()}
                        <div className="cce-modal-actions">
                            <button className="cce-modal-btn cancel" onClick={handleCloseModal}>Annuler</button>
                            <button className="cce-modal-btn validate" onClick={handleValidateModal}>
                                {activeModal === "reedit_alert" ? "Continuer" : "Valider"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};