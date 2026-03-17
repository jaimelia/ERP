import {useState, type FC} from "react";

interface Product {
    id: number;
    produit: string;
    quantite: string;
    type: "Carburant" | "Produit";
    prix: string;
}

// TODO : remplacer par des appels API
const mockProducts: Product[] = [
    {id: 1, produit: "Sans plomb 95", quantite: "1200 L", type: "Carburant", prix: "1.750 €/L"},
    {id: 2, produit: "Stylo bille BIC", quantite: "196", type: "Produit", prix: "1.57 €"},
    {id: 3, produit: "Essuie-glace", quantite: "15", type: "Produit", prix: "24.50 €"},
    {id: 4, produit: "Lave-glace", quantite: "28", type: "Produit", prix: "9.90 €"},
    {id: 5, produit: "Arbre magique", quantite: "37", type: "Produit", prix: "0.99 €"},
];

export const ManagerProductsWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState("Tous");

    const filtered = mockProducts.filter(m => {
        const matchSearch = m.produit.toLowerCase().includes(search.toLowerCase());
        const matchType = filtre === "Tous" || m.type === filtre;
        return matchSearch && matchType;
    });

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
                        placeholder="Rechercher une marchandise"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="widget-select"
                    value={filtre}
                    onChange={e => setFiltre(e.target.value)}
                >
                    <option>Tous</option>
                    <option>Carburant</option>
                    <option>Produit</option>
                </select>
            </div>

            <div className="widget-table-wrap">
                <table className="widget-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité</th>
                            <th>Type</th>
                            <th>Prix</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(m => (
                            <tr key={m.id}>
                                <td>{m.produit}</td>
                                <td>{m.quantite}</td>
                                <td>{m.type}</td>
                                <td>{m.prix}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="icon-btn" type="button" title="Modifier">
                                            ✏️
                                        </button>
                                        <button className="icon-btn delete" type="button" title="Supprimer">
                                            🗑️
                                        </button>
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
