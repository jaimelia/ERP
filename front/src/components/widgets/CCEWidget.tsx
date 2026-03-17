import {useState, type FC} from "react";

interface CompteEntreprise {
    id: number;
    nom: string;
    prenom: string;
    numeroCCE: string;
    statut: "Active" | "Désactivée";
    dateCreation: string;
    montantCredite: string;
}

// TODO : remplacer par des appels API
const mockCCE: CompteEntreprise[] = [
    {id: 1, nom: "CARLI", prenom: "Mathéo", numeroCCE: "****9999", statut: "Active", dateCreation: "11/12/2025 15:35", montantCredite: "35.25€"},
    {id: 2, nom: "POMEL", prenom: "Matthieu", numeroCCE: "****8888", statut: "Désactivée", dateCreation: "02/12/2025 15:30", montantCredite: "12.64€"},
    {id: 3, nom: "LACHAL", prenom: "Bryan", numeroCCE: "****7777", statut: "Active", dateCreation: "01/11/2025 14:15", montantCredite: "10.68€"},
    {id: 4, nom: "BEDETTI", prenom: "Louis", numeroCCE: "****5555", statut: "Désactivée", dateCreation: "04/10/2025 10:55", montantCredite: "152.66€"},
];

export const CCEWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number | null>(null);

    const filtered = mockCCE.filter(c =>
        `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        c.numeroCCE.includes(search)
    );

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
                <button className="widget-settings-btn" type="button" title="Paramètres">⚙️</button>
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
                <button className="cce-action-btn" type="button">Créer</button>
                <button className="cce-action-btn" type="button">Modifier</button>
                <button className="cce-action-btn" type="button">Créditer</button>
                <button className="cce-action-btn" type="button">Désactiver</button>
                <button className="cce-action-btn" type="button">Voir transactions</button>
                <button className="cce-action-btn" type="button">Rééditer</button>
            </div>
        </div>
    );
};
