import {useState, type FC} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {apiUrl, fetchJsonWithAuth} from "../../api/common.ts";

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

    const openModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditedCustomer(customer);
    };

    const closeModal = () => {
        setSelectedCustomer(null);
        setEditedCustomer({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedCustomer(prev => ({...prev, [name]: value}));
    };

    const handleConfirm = async () => {
        if (!editedCustomer.idClient) return;

        const updatedCustomer = await fetchJsonWithAuth(apiUrl(`/clients/${editedCustomer.idClient}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedCustomer)
        });
        setCustomers(prev => prev?.map(c => c.idClient === editedCustomer.idClient ? updatedCustomer : c) ?? []);
        closeModal();
    };

    const filtered = customers?.filter(c =>
        `${c.lastname} ${c.firstname}`.toLowerCase().includes(search.toLowerCase()) ||
        c.mail.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search)
    ) ?? [];

    const renderModal = () => {
        if (!selectedCustomer) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Modifier le client</h2>
                    <div className="form-group">
                        <label>Nom</label>
                        <input type="text" name="lastname" value={editedCustomer.lastname || ''}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Prénom</label>
                        <input type="text" name="firstname" value={editedCustomer.firstname || ''}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Adresse mail</label>
                        <input type="email" name="mail" value={editedCustomer.mail || ''} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>N° Tel</label>
                        <input type="tel" name="phoneNumber" value={editedCustomer.phoneNumber || ''}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={closeModal}>Annuler</button>
                        <button type="button" onClick={handleConfirm}>Confirmer</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container">
                <div className="widget-toolbar">
                    <div className="widget-search">
                        <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5">
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
                            <tr key={c.idClient}>
                                <td>{c.lastname}</td>
                                <td>{c.firstname}</td>
                                <td>
                                    <span className="cell-truncate" title={c.mail}>{c.mail}</span>
                                </td>
                                <td>{c.phoneNumber}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="action-btn" type="button"
                                                onClick={() => openModal(c)}>Modifier
                                        </button>
                                        <button className="action-btn" type="button">Transactions</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {renderModal()}
            </div>
        </FetchWrapper>
    );
};
