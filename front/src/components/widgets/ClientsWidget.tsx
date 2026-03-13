import {useState, type FC} from "react";

interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
}

// Données mockées — seront remplacées par des appels API
const mockClients: Client[] = [
    {id: 1, nom: "Carli", prenom: "Mathéo", email: "matheo.carli@jmail.com", telephone: "06.95.90.41.23"},
    {id: 2, nom: "Pomel", prenom: "Matthéo", email: "mattheo.pomel@jmail.com", telephone: "06.09.25.43.03"},
    {id: 3, nom: "Carly", prenom: "Matheau", email: "matheau.carly@jmail.com", telephone: "06.86.78.96.01"},
    {id: 4, nom: "Karli", prenom: "Mathaio", email: "mathaio.karli@jmail.com", telephone: "06.33.63.69.81"},
    {id: 5, nom: "Karly", prenom: "Matéo", email: "mateo.karly@jmail.com", telephone: "07.68.13.24.18"},
];

export const ClientsWidget: FC = () => {
    const [search, setSearch] = useState("");

    const filtered = mockClients.filter(c =>
        `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.telephone.includes(search)
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
                        placeholder="Rechercher un client"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="widget-table-wrap">
                <table className="widget-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Adresse mail</th>
                            <th>N° Tel</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td>{c.nom}</td>
                                <td>{c.prenom}</td>
                                <td>
                                    <span className="cell-truncate" title={c.email}>{c.email}</span>
                                </td>
                                <td>{c.telephone}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="action-btn" type="button">Modifier</button>
                                        <button className="action-btn" type="button">Transactions</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
