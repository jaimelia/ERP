import {type FC, useEffect, useState} from "react";
import {apiUrl, fetchJsonWithAuth} from "../../api/common.ts";
import {Popup} from "../Popup.tsx";

interface CCE {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    code: string;
    numeroCCE: string;
    statut: "Active" | "Désactivée";
    dateCreation: string;
    montantCredite: string;
}

interface CCETransaction {
    idTransaction: number;
    type: string;
    date: string;
    amount: number;
}

interface BonusTier {
    id?: number;
    minAmount: string;
    bonusAmount: string;
}

interface CCESettingsData {
    minimumCreditAmount: string;
    bonusTiers: BonusTier[];
}

type PopupType = "create" | "edit" | "credit" | "transactions" | "reedit_alert" | "reedit" | null;

export const EmployeeCCEWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number | null>(null);
    const [cces, setCces] = useState<CCE[]>([]);

    const [activePopup, setActivePopup] = useState<PopupType>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [cardTransactions, setCardTransactions] = useState<CCETransaction[]>([]);
    const [settingsData, setSettingsData] = useState<CCESettingsData>({ minimumCreditAmount: "", bonusTiers: [] });

    const loadCces = async () => {
        try {
            const data = await fetchJsonWithAuth(apiUrl("/cce"));
            const formattedData = data.map((item: any) => ({
                id: item.id,
                nom: item.nom,
                prenom: item.prenom,
                email: item.email,
                tel: item.tel,
                code: item.code.toString(),
                numeroCCE: item.id.toString().padStart(4, '0'),
                statut: item.statut === "activated" ? "Active" : "Désactivée",
                dateCreation: new Date(item.dateCreation).toLocaleDateString("fr-FR"),
                montantCredite: `${item.montantCredite.toFixed(2)}€`
            }));
            setCces(formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const loadSettings = async () => {
        try {
            const data = await fetchJsonWithAuth(apiUrl("/cce/settings"));
            setSettingsData({
                minimumCreditAmount: data.minimumCreditAmount?.toString() || "",
                bonusTiers: data.bonusTiers?.map((t: any) => ({
                    id: t.id,
                    minAmount: t.minAmount.toString(),
                    bonusAmount: t.bonusAmount.toString()
                })) || []
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCces();
        loadSettings();
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

    const handleOpenPopup = async (type: PopupType) => {
        setErrors({});

        if ((type === "edit" || type === "reedit") && selected) {
            const currentCce = cces.find(c => c.id === selected);
            if (currentCce) {
                setFormData({
                    nom: currentCce.nom,
                    prenom: currentCce.prenom,
                    email: currentCce.email,
                    tel: currentCce.tel,
                    code: currentCce.code
                });
            }
        } else {
            setFormData({});
        }

        if (type === "transactions" && selected) {
            try {
                const data = await fetchJsonWithAuth(apiUrl(`/cce/${selected}/transactions`));
                setCardTransactions(data);
            } catch (error) {
                console.error(error);
            }
        } else {
            setCardTransactions([]);
        }

        if (type === "credit") {
            await loadSettings();
        }

        setActivePopup(type);
    };

    const handleClosePopup = () => {
        setActivePopup(null);
        setFormData({});
        setErrors({});
        setCardTransactions([]);
    };

    const handleValidatePopup = async () => {
        if (activePopup === "reedit_alert") {
            handleOpenPopup("reedit");
            return;
        }

        const newErrors: Record<string, boolean> = {};
        let isValid = true;

        const checkField = (field: string) => {
            if (!formData[field] || formData[field].trim() === "") {
                newErrors[field] = true;
                isValid = false;
            }
        };

        if (activePopup === "create") {
            ["nom", "prenom", "email", "tel", "code", "montant"].forEach(checkField);
        } else if (activePopup === "reedit" || activePopup === "edit") {
            ["nom", "prenom", "email", "tel", "code"].forEach(checkField);
        } else if (activePopup === "credit") {
            checkField("amount");
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        try {
            switch (activePopup) {
                case "credit":
                    await fetchJsonWithAuth(apiUrl(`/cce/${selected}/credit`), {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount: parseFloat(formData.amount) }),
                    });
                    break;
                case "create":
                    await fetchJsonWithAuth(apiUrl("/cce"), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nom: formData.nom,
                            prenom: formData.prenom,
                            email: formData.email,
                            tel: formData.tel,
                            code: formData.code,
                            montant: parseFloat(formData.montant),
                        }),
                    });
                    break;
                case "edit":
                    await fetchJsonWithAuth(apiUrl(`/cce/${selected}`), {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nom: formData.nom,
                            prenom: formData.prenom,
                            email: formData.email,
                            tel: formData.tel,
                            code: formData.code,
                        }),
                    });
                    break;
                case "reedit":
                    await fetchJsonWithAuth(apiUrl(`/cce/${selected}/reedit`), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nom: formData.nom,
                            prenom: formData.prenom,
                            email: formData.email,
                            tel: formData.tel,
                            code: formData.code,
                            montant: 0,
                        }),
                    });
                    break;
                default:
                    break;
            }
            await loadCces();
            setSelected(null);
        } catch (error) {
            console.error(error);
        } finally {
            handleClosePopup();
        }
    };
    const calculateBonus = (amountStr: string) => {
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return 0;

        const applicableTiers = settingsData.bonusTiers
            .filter(t => amount >= parseFloat(t.minAmount))
            .sort((a, b) => parseFloat(b.minAmount) - parseFloat(a.minAmount));

        if (applicableTiers.length > 0) {
            return parseFloat(applicableTiers[0].bonusAmount) || 0;
        }
        return 0;
    };

    const filtered = cces.filter(c =>
        `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        c.numeroCCE.includes(search)
    );

    const selectedCard = cces.find(c => c.id === selected);
    const toggleButtonText = selectedCard?.statut === "Active" ? "Désactiver" : "Activer";

    // Bloque la saisie des caractères e, E, + et -
    const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    };

    const renderField = (name: string, label: string, type = "text", maxLength?: number, fullSpan = false) => (
        <div className={`field-group ${fullSpan ? 'full-span' : ''}`}>
            <label className="field-label">{label}</label>
            <input
                type={type}
                placeholder={label}
                maxLength={maxLength}
                min={type === "number" ? "0" : undefined}
                onKeyDown={type === "number" ? blockInvalidChar : undefined}
                value={formData[name] || ""}
                onChange={e => {
                    const val = type === "number" ? e.target.value.replace(",", ".") : e.target.value;
                    setFormData({ ...formData, [name]: val });
                    if (errors[name]) setErrors({ ...errors, [name]: false });
                }}
                className={errors[name] ? "error-input" : ""}
            />
            {errors[name] && <span className="error-text">Ce champ est requis</span>}
        </div>
    );

    const getPopupConfig = () => {
        if (!activePopup) return null;

        const baseFooter = (text: string, className = "") => (
            <>
                <button className="popup-btn cancel" onClick={handleClosePopup}>Annuler</button>
                <button className={`popup-btn validate ${className}`} onClick={handleValidatePopup}>{text}</button>
            </>
        );

        switch (activePopup) {
            case "credit":
            { const bonusAmount = calculateBonus(formData.amount || "0");
                return {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                    title: "Créditer la CCE",
                    subtitle: `Ajouter des fonds à la carte N° ${selectedCard?.numeroCCE}`,
                    content: (
                        <div className="popup-form">
                            <div className="field-group full-span">
                                <label className="field-label">Montant à créditer (€)</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Montant à créditer (€)"
                                        value={formData.amount || ""}
                                        onKeyDown={blockInvalidChar}
                                        onChange={e => {
                                            setFormData({ ...formData, amount: e.target.value.replace(",", ".") });
                                            if (errors["amount"]) setErrors({ ...errors, amount: false });
                                        }}
                                        className={errors["amount"] ? "error-input" : ""}
                                        style={{ flex: 1 }}
                                    />
                                    {bonusAmount > 0 && (
                                        <span style={{ color: "#10b981", fontWeight: 600, fontSize: "14px", minWidth: "80px" }}>
                                            (+{bonusAmount.toFixed(2)}€)
                                        </span>
                                    )}
                                </div>
                                {errors["amount"] && <span className="error-text">Ce champ est requis</span>}
                            </div>
                        </div>
                    ),
                    footer: baseFooter("Confirmer l'action")
                }; }
            case "create":
                return {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>,
                    title: "Créer un nouveau compte CCE",
                    subtitle: "Saisir les informations du client et de la carte",
                    content: (
                        <div className="popup-form">
                            {renderField("nom", "Nom")}
                            {renderField("prenom", "Prénom")}
                            {renderField("email", "Email", "email")}
                            {renderField("tel", "Téléphone", "tel")}
                            {renderField("code", "Code (PIN)", "text", 4)}
                            {renderField("montant", "Montant initial (€)", "number", undefined, true)}
                        </div>
                    ),
                    footer: baseFooter("Confirmer l'action")
                };
            case "reedit":
                return {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
                    title: "Rééditer une CCE",
                    subtitle: `Remplacer la carte N° ${selectedCard?.numeroCCE}`,
                    content: (
                        <div className="popup-form">
                            {renderField("nom", "Nom")}
                            {renderField("prenom", "Prénom")}
                            {renderField("email", "Email", "email")}
                            {renderField("tel", "Téléphone", "tel")}
                            {renderField("code", "Code (PIN)", "text", 4)}
                        </div>
                    ),
                    footer: baseFooter("Confirmer l'action")
                };
            case "edit":
                return {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
                    title: "Modifier les informations",
                    subtitle: `Mise à jour du client lié à la carte N° ${selectedCard?.numeroCCE}`,
                    content: (
                        <div className="popup-form">
                            {renderField("nom", "Nom")}
                            {renderField("prenom", "Prénom")}
                            {renderField("email", "Email", "email", undefined, true)}
                            {renderField("tel", "Téléphone", "tel", undefined, true)}
                            {renderField("code", "Nouveau code (PIN)", "text", 4, true)}
                        </div>
                    ),
                    footer: baseFooter("Confirmer l'action")
                };
            case "reedit_alert":
                return {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                    title: "Action irréversible",
                    subtitle: "Confirmation de réédition requise",
                    content: (
                        <div className="alert-content">
                            <p className="alert-text">
                                Vous êtes sur le point de rééditer la carte CCE <strong style={{color:'var(--color-accent)'}}>N° {selectedCard?.numeroCCE}</strong>.<br/>
                                L'ancienne carte sera <strong>désactivée</strong> et une nouvelle carte sera créée avec les informations que vous allez saisir.<br/><br/>
                                Voulez-vous continuer ?
                            </p>
                        </div>
                    ),
                    footer: baseFooter("Continuer vers la réédition", "warning")
                };
            case "transactions":
                return {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
                    title: "Historique des transactions",
                    subtitle: `Activité de la carte N° ${selectedCard?.numeroCCE}`,
                    content: (
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {cardTransactions.length > 0 ? (
                                <table className="widget-table" style={{ width: '100%', borderBottom: 'none' }}>
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Montant</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cardTransactions.map(t => (
                                        <tr key={t.idTransaction}>
                                            <td>{new Date(t.date).toLocaleDateString("fr-FR")}</td>
                                            <td>{t.type}</td>
                                            <td style={{ fontWeight: '500' }}>{t.amount.toFixed(2)}€</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "20px 0" }}>
                                    Aucune transaction trouvée pour cette carte.
                                </p>
                            )}
                        </div>
                    ),
                    footer: <button className="popup-btn cancel" onClick={handleClosePopup}>Fermer</button>
                };
        }
    };

    const popupConfig = getPopupConfig();

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
                        placeholder="Rechercher par nom ou numéro..."
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
                <button className="cce-action-btn" type="button" onClick={() => handleOpenPopup("create")}>Créer</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenPopup("edit")}>Modifier</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenPopup("credit")}>Créditer</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={handleToggleStatus}>{toggleButtonText}</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenPopup("transactions")}>Voir transactions</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={() => handleOpenPopup("reedit_alert")}>Rééditer</button>
            </div>

            {popupConfig && activePopup !== null && (
                <Popup
                    onClose={handleClosePopup}
                    icon={popupConfig.icon}
                    title={popupConfig.title}
                    subtitle={popupConfig.subtitle}
                    footer={popupConfig.footer}
                >
                    {popupConfig.content}
                </Popup>
            )}
        </div>
    );
};