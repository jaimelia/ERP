import {useState, type FC} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {apiUrl} from "../../api/common.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {formatQuantity, type ItemType} from "../../types.ts";
import {useModal} from "../../context/ModalContext.tsx";

interface Restock {
    id: number;
    itemName: string;
    quantity: number;
    status: "pending" | "delivered" | "canceled";
    date: string;
    itemType: ItemType;
}

export const ManagerRestockWidget: FC = () => {
    const [search, setSearch] = useState("");
    const {openModal, closeModal} = useModal();

    const {data: restocks, setData: setRestocks, loading, error} = useFetch<Restock[]>(
        apiUrl("/restocks"),
        5000
    );

    const filtered = !restocks ? [] : restocks.filter(r =>
        r.itemName.toLowerCase().includes(search.toLowerCase())
    );

    const translateStatus = (status: "pending" | "delivered" | "canceled"): string => {
        switch (status) {
            case "pending":
                return "en attente";
            case "canceled":
                return "annulé";
            case "delivered":
                return "livré";
        }
    }

    const openNewRestockModal = () => {
        openModal(
            <div className="modal-content">
                <h2>Nouveau réapprovisionnement</h2>
                <div>

                </div>
                <div className="modal-actions">
                    <button className="modal-button modal-button--cancel" onClick={closeModal}>
                        Annuler
                    </button>
                    <button
                        className={`modal-button "modal-button--confirm"`}
                        onClick={() => {
                            //onConfirm();
                            closeModal();
                        }}
                    >
                        Valider
                    </button>
                </div>
            </div>
        )
    }

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
                            placeholder="Rechercher un réapprovisionnement"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="widget-btn" type="button">Seuils</button>
                    <button className="widget-btn-add" type="button" title="Ajouter">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                        </svg>
                    </button>
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
                        {filtered.map(restock => (
                            <tr key={restock.id}>
                                <td>{restock.itemName}</td>
                                <td>{formatQuantity(restock.quantity, restock.itemType)}</td>
                                <td>
                                        <span className={`status-badge status-${restock.status}`}>
                                            {translateStatus(restock.status)}
                                        </span>
                                </td>
                                <td>{restock.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </FetchWrapper>
    );
};
