import {useState, type FC} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {apiUrl} from "../../api/common.ts";

interface Customer {
    idClient: number;
    lastname: string;
    firstname: string;
    mail: string;
    phoneNumber: string;
}

export const CustomersWidget: FC = () => {
    const [search, setSearch] = useState("");

    const {data: customers, loading, error} = useFetch<Customer[]>(
        apiUrl("/clients"),
        5000
    );

    const filtered = customers?.filter(c =>
        `${c.lastname} ${c.firstname}`.toLowerCase().includes(search.toLowerCase()) ||
        c.mail.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search)
    ) ?? [];

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
        </FetchWrapper>
    );
};
