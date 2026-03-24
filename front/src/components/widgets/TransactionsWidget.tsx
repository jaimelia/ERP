import {useState, type FC} from "react";

interface Transaction {
    id: string;
    dateHeure: string;
    type: "Carburant" | "Boutique" | "Mixte";
    produit: string;
    quantite: string;
    montantTotal: string;
    modePaiement: string;
    equipement: string;
    statut: "Validée" | "Annulée" | "Remboursée";
}

// TODO : remplacer par des appels API
const mockTransactions: Transaction[] = [
    {
        id: "TR-000 145",
        dateHeure: "18/02/2026 08:15",
        type: "Carburant",
        produit: "Diesel 42.35 L",
        quantite: "42.35",
        montantTotal: "61.41 €",
        modePaiement: "CCE",
        equipement: "Pompe 1",
        statut: "Validée",
    },
    {
        id: "TR-000 146",
        dateHeure: "18/02/2026 08:22",
        type: "Boutique",
        produit: "Coca 33 Cl",
        quantite: "2",
        montantTotal: "2.49 €",
        modePaiement: "Carte bancaire",
        equipement: "—",
        statut: "Annulée",
    },
    {
        id: "TR-000 147",
        dateHeure: "18/02/2026 08:38",
        type: "Mixte",
        produit: "SP05 + Snack",
        quantite: "35 L + 1",
        montantTotal: "58.70 €",
        modePaiement: "Espèces",
        equipement: "Pompe 5",
        statut: "Remboursée",
    },
];

const statutClass: Record<Transaction["statut"], string> = {
    Validée: "status-valide",
    Annulée: "status-annule",
    Remboursée: "status-rembourse",
};

export const TransactionsWidget: FC = () => {
    const [search, setSearch] = useState("");

    const filtered = mockTransactions.filter(t =>
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.produit.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase())
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
                        placeholder="Rechercher une transaction"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="widget-table-wrap">
                <table className="widget-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date &amp; heure</th>
                            <th>Type</th>
                            <th>Produit</th>
                            <th>Qté</th>
                            <th>Montant total</th>
                            <th>Mode de paiement</th>
                            <th>Équipement</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.id}>
                                <td style={{fontFamily: "monospace", fontSize: "11px"}}>{t.id}</td>
                                <td>{t.dateHeure}</td>
                                <td>{t.type}</td>
                                <td>{t.produit}</td>
                                <td>{t.quantite}</td>
                                <td>{t.montantTotal}</td>
                                <td>{t.modePaiement}</td>
                                <td>{t.equipement}</td>
                                <td>
                                    <span className={`status-badge ${statutClass[t.statut]}`}>
                                        {t.statut}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
