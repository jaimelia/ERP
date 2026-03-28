import {useState, type FC} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {apiUrl, fetchJsonWithAuth} from "../../api/common.ts";
import {Popup} from "../Popup.tsx";

interface Customer {
    idClient: number;
    lastname: string;
    firstname: string;
    mail: string;
    phoneNumber: string;
}

interface Transaction {
    idTransaction: number;
    type: string;
    transactionDate: string;
    isFromAutomat: boolean;
    status: string;
}

export const CustomersWidget: FC = () => {
    const [search, setSearch] = useState("");

    // États pour le popup de modification
    const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState<Customer | null>(null);
    const [editedCustomer, setEditedCustomer] = useState<Partial<Customer>>({});

    // États pour le popup des transactions
    const [selectedCustomerForTx, setSelectedCustomerForTx] = useState<Customer | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTx, setLoadingTx] = useState(false);
    const [errorTx, setErrorTx] = useState<string | null>(null);

    const {data: customers, loading, error, setData: setCustomers} = useFetch<Customer[]>(
        apiUrl("/clients")
    );

    // --- Gestion du popup de modification ---
    const handleOpenEditPopup = (customer: Customer) => {
        setSelectedCustomerForEdit(customer);
        setEditedCustomer(customer);
    };

    const handleCloseEditPopup = () => {
        setSelectedCustomerForEdit(null);
        setEditedCustomer({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedCustomer(prev => ({...prev, [name]: value}));
    };

    const handleConfirmEdit = async () => {
        if (!editedCustomer.idClient) return;

        try {
            const updatedCustomer = await fetchJsonWithAuth(apiUrl(`/clients/${editedCustomer.idClient}`), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedCustomer)
            });

            if (customers) {
                setCustomers(customers.map(c => c.idClient === updatedCustomer.idClient ? updatedCustomer : c));
            }
            handleCloseEditPopup();
        } catch (err) {
            console.error(err);
        }
    };

    // --- Gestion du popup des transactions ---
    const handleOpenTxPopup = async (customer: Customer) => {
        setSelectedCustomerForTx(customer);
        setLoadingTx(true);
        setErrorTx(null);
        try {
            const txData = await fetchJsonWithAuth(apiUrl(`/clients/${customer.idClient}/transactions`));
            setTransactions(txData);
        } catch (err) {
            setErrorTx(err instanceof Error ? err.message : "Erreur lors du chargement des transactions");
        } finally {
            setLoadingTx(false);
        }
    };

    const handleCloseTxPopup = () => {
        setSelectedCustomerForTx(null);
        setTransactions([]);
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'Validée';
            case 'canceled':
                return 'Annulée';
            case 'inProgress':
                return 'Remboursée';
            default:
                return status;
        }
    };


    const filtered = (customers || []).filter(c =>
        `${c.lastname} ${c.firstname}`.toLowerCase().includes(search.toLowerCase()) ||
        c.mail.toLowerCase().includes(search.toLowerCase())
    );

    const renderField = (name: keyof Customer, label: string, type = "text") => (
        <div className="field-group">
            <label className="field-label">{label}</label>
            <input
                type={type}
                name={name}
                placeholder={label}
                value={(editedCustomer[name] as string) || ""}
                onChange={handleInputChange}
            />
        </div>
    );

    const editPopupFooter = (
        <>
            <button className="popup-btn cancel" onClick={handleCloseEditPopup}>Annuler</button>
            <button className="popup-btn validate" onClick={handleConfirmEdit}>Sauvegarder</button>
        </>
    );

    const txPopupFooter = (
        <button className="popup-btn cancel" onClick={handleCloseTxPopup}>Fermer</button>
    );

    return (
        <div className="widget-container">
            <FetchWrapper loading={loading} error={error}>
                <div className="widget-toolbar">
                    <div className="widget-search">
                        <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
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
                            <tr key={c.idClient}>
                                <td>{c.lastname}</td>
                                <td>{c.firstname}</td>
                                <td>
                                    <span className="cell-truncate" title={c.mail}>{c.mail}</span>
                                </td>
                                <td>{c.phoneNumber}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="action-btn" type="button" onClick={() => handleOpenEditPopup(c)}>Modifier</button>
                                        <button className="action-btn" type="button" onClick={() => handleOpenTxPopup(c)}>Transactions</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Popup
                    isOpen={selectedCustomerForEdit !== null}
                    onClose={handleCloseEditPopup}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                    title="Modifier le client"
                    subtitle={`Mise à jour des informations de ${selectedCustomerForEdit?.firstname} ${selectedCustomerForEdit?.lastname}`}
                    footer={editPopupFooter}
                >
                    <div className="popup-form">
                        {renderField("lastname", "Nom")}
                        {renderField("firstname", "Prénom")}
                        {renderField("mail", "Email", "email")}
                        {renderField("phoneNumber", "Téléphone", "tel")}
                    </div>
                </Popup>

                <Popup
                    isOpen={selectedCustomerForTx !== null}
                    onClose={handleCloseTxPopup}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                    title="Historique des transactions"
                    subtitle={`Transactions de ${selectedCustomerForTx?.firstname} ${selectedCustomerForTx?.lastname}`}
                    footer={txPopupFooter}
                >
                    <div className="popup-content">
                        {loadingTx ? (
                            <p>Chargement des transactions...</p>
                        ) : errorTx ? (
                            <p style={{ color: 'red' }}>Erreur : {errorTx}</p>
                        ) : transactions.length === 0 ? (
                            <p>Aucune transaction trouvée pour ce client.</p>
                        ) : (
                            <div className="widget-table-wrap">
                                <table className="widget-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(tx => (
                                            <tr key={tx.idTransaction}>
                                                <td>{tx.idTransaction}</td>
                                                <td>{tx.transactionDate}</td>
                                                <td>{tx.type}</td>
                                                <td>
                                                    <span className={`status-badge ${tx.status === 'accepted' ? 'status-valide' : tx.status === 'canceled' ? 'status-annule' : 'status-rembourse'}`}>
                                                        {translateStatus(tx.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </Popup>
            </FetchWrapper>
        </div>
    );
};