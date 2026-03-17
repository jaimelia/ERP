import {useState, type FC} from "react";

interface Reappro {
    id: number;
    produit: string;
    quantite: string;
    statut: "en cours" | "effectué";
    date: string;
}

// TODO : remplacer par des appels API
const mockReappros: Reappro[] = [
    {id: 1, produit: "Sans plomb 95", quantite: "400 L", statut: "en cours", date: "11/12/2025 15:35"},
    {id: 2, produit: "Diesel", quantite: "300 L", statut: "en cours", date: "02/12/2025 09:42"},
    {id: 3, produit: "Sans plomb 98", quantite: "500 L", statut: "en cours", date: "21/11/2025 16:14"},
    {id: 4, produit: "Sans plomb 98", quantite: "10 L", statut: "effectué", date: "21/11/2025 16:14"},
    {id: 5, produit: "Sans plomb 98", quantite: "500 L", statut: "effectué", date: "21/11/2025 16:14"},
    {id: 6, produit: "Sans plomb 98", quantite: "500 L", statut: "effectué", date: "21/11/2025 16:14"},
    {id: 7, produit: "Sans plomb 98", quantite: "500 L", statut: "effectué", date: "21/11/2025 16:14"},
    {id: 8, produit: "Sans plomb 98", quantite: "500 L", statut: "effectué", date: "21/11/2025 16:14"},
    {id: 9, produit: "Sans plomb 98", quantite: "500 L", statut: "effectué", date: "21/11/2025 16:14"},
];

export const ReapprovisionnementWidget: FC = () => {
    const [search, setSearch] = useState("");

    const filtered = mockReappros.filter(r =>
        r.produit.toLowerCase().includes(search.toLowerCase())
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
                        placeholder="Rechercher un réapprovisionnement"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button className="widget-btn" type="button">Seuils</button>
                <button className="widget-btn-add" type="button" title="Ajouter">+</button>
            </div>

            <div className="widget-table-wrap">
                <table className="widget-table">
                    <thead>
                        <tr>
                            <th>Produit / Carburant</th>
                            <th>Quantité</th>
                            <th>Statut</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id}>
                                <td>{r.produit}</td>
                                <td>{r.quantite}</td>
                                <td>
                                    <span className={`status-badge status-${r.statut === "en cours" ? "en-cours" : "effectue"}`}>
                                        {r.statut}
                                    </span>
                                </td>
                                <td>{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
