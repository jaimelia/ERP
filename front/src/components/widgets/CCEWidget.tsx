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

export const CCEWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number | null>(null);
    const [cces, setCces] = useState<CCE[]>([]);

    useEffect(() => {
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

        loadCces();
    }, []);

    const handleToggleStatus = async () => {
        if (!selected) return;

        try {
            // Appel API sans body requis
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

    const filtered = cces.filter(c =>
        `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        c.numeroCCE.includes(search)
    );

    const selectedCard = cces.find(c => c.id === selected);
    const toggleButtonText = selectedCard?.statut === "Active" ? "Désactiver" : "Activer";

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
                <button className="widget-settings-btn" type="button" title="Paramètres">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
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
                <button className="cce-action-btn" type="button" disabled={!selected}>Créer</button>
                <button className="cce-action-btn" type="button" disabled={!selected}>Modifier</button>
                <button className="cce-action-btn" type="button" disabled={!selected}>Créditer</button>
                <button className="cce-action-btn" type="button" disabled={!selected} onClick={handleToggleStatus}>
                    {toggleButtonText}
                </button>
                <button className="cce-action-btn" type="button" disabled={!selected}>Voir transactions</button>
                <button className="cce-action-btn" type="button" disabled={!selected}>Rééditer</button>
            </div>
        </div>
    );
};