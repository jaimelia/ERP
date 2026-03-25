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

export const CustomersWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [editedCustomer, setEditedCustomer] = useState<Partial<Customer>>({});

    const {data: customers, loading, error, setData: setCustomers} = useFetch<Customer[]>(
        apiUrl("/clients")
    );

    const handleOpenPopup = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditedCustomer(customer);
    };

    const handleClosePopup = () => {
        setSelectedCustomer(null);
        setEditedCustomer({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedCustomer(prev => ({...prev, [name]: value}));
    };

    const handleConfirm = async () => {
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
            handleClosePopup();
        } catch (err) {
            console.error(err);
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

    const popupFooter = (
        <>
            <button className="popup-btn cancel" onClick={handleClosePopup}>Annuler</button>
            <button className="popup-btn validate" onClick={handleConfirm}>Sauvegarder</button>
        </>
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
                                        <button className="action-btn" type="button" onClick={() => handleOpenPopup(c)}>Modifier</button>
                                        <button className="action-btn" type="button">Transactions</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Popup
                    isOpen={selectedCustomer !== null}
                    onClose={handleClosePopup}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                    title="Modifier le client"
                    subtitle={`Mise à jour des informations de ${selectedCustomer?.firstname} ${selectedCustomer?.lastname}`}
                    footer={popupFooter}
                >
                    <div className="popup-form">
                        {renderField("lastname", "Nom")}
                        {renderField("firstname", "Prénom")}
                        {renderField("mail", "Email", "email")}
                        {renderField("phoneNumber", "Téléphone", "tel")}
                    </div>
                </Popup>
            </FetchWrapper>
        </div>
    );
};