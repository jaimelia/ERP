import {type FC, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {apiUrl} from "../../api/common.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {formatPrice, formatQuantity, type ItemType} from "../../types.ts";
import {useModal} from "../../contexts/ModalContext.tsx";
import {
    createRestock,
    type RestockableItemDTO,
    updateThresholds,
    type UpdateThresholdsDTO
} from "../../api/itemsApi.ts";
import DecimalInput from "../DecimalInput.tsx";
import {Popup} from "../Popup.tsx";

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
    const {openModal} = useModal();

    const {data: restocks, setData: setRestocks, loading, error} = useFetch<Restock[]>(
        apiUrl("/restocks"),
        5000
    );

    const filtered = !restocks ? [] : restocks
        .filter(r => r.itemName.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.date.localeCompare(a.date));

    const translateStatus = (status: "pending" | "delivered" | "canceled"): string => {
        switch (status) {
            case "pending":
                return "en attente";
            case "canceled":
                return "annule";
            case "delivered":
                return "livre";
        }
    };

    const openNewRestockModal = () => {
        openModal(
            <NewRestockModal
                onConfirm={async (product, quantity) => {
                    const result = await createRestock({idItem: product.id, quantity});
                    setRestocks(prev => prev ? [...prev, result] : [result]);
                }}
            />,
            {boxed: false}
        );
    };

    const openThresholdModal = () => {
        openModal(
            <ThresholdsModal
                onConfirm={thresholds => {
                    const updateThresholdsDTOs: UpdateThresholdsDTO[] = thresholds.map(threshold => ({
                        idItem: threshold.id,
                        alertThreshold: threshold.alertThreshold ?? null,
                        autoRestockQuantity: threshold.autoRestockQuantity ?? null
                    }));

                    void updateThresholds(updateThresholdsDTOs);
                }}
            />,
            {boxed: false}
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
                            placeholder="Rechercher un reapprovisionnement"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="widget-btn" type="button" onClick={openThresholdModal}>Seuils</button>
                    <button className="widget-btn-add" type="button" title="Ajouter" onClick={openNewRestockModal}>
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
                            <th>Quantite</th>
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

interface NewRestockModalProps {
    onConfirm: (product: RestockableItemDTO, quantity: number) => void;
}

const NewRestockModal: FC<NewRestockModalProps> = ({onConfirm}) => {
    const {closeModal} = useModal();
    const [selectedProduct, setSelectedProduct] = useState<RestockableItemDTO | undefined>();
    const [quantity, setQuantity] = useState<number>(0);
    const [search, setSearch] = useState<string>();

    const {data: restockables, loading, error} = useFetch<RestockableItemDTO[]>(apiUrl("/items/restockables"));

    const filtered = !restockables ? [] : restockables.filter(product =>
        !search || product.name.trim().toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <FetchWrapper loading={loading} error={error}>
            <Popup
                className="modal-new-restock"
                title="Nouveau reapprovisionnement"
                footer={
                    <>
                        <button className="popup-btn cancel" onClick={closeModal}>
                            Annuler
                        </button>
                        <button
                            className="popup-btn validate"
                            onClick={() => {
                                onConfirm(selectedProduct!, quantity);
                                closeModal();
                            }}
                            disabled={selectedProduct === undefined || quantity <= 0}
                        >
                            Valider
                        </button>
                    </>
                }
            >
                <div className="widget-search">
                    <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher un reapprovisionnement"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="products-list">
                    {filtered.map(item => (
                        <div
                            key={item.id}
                            className={`product-item ${selectedProduct?.id === item.id ? "selected" : ""}`}
                            onClick={() => selectedProduct?.id === item.id
                                ? setSelectedProduct(undefined)
                                : setSelectedProduct(item)}
                        >
                            <span>{item.name}</span>
                            <span>{`Stock : ${formatQuantity(item.quantity, item.itemType)}`}</span>
                        </div>
                    ))}
                </div>
                <div className="modal-options">
                    <div>
                        <label htmlFor="quantity">Quantite</label>
                        <DecimalInput
                            id="quantity"
                            nbDecimalPlaces={0}
                            onChange={e => setQuantity(parseInt(e.target.value))}
                        />
                        {selectedProduct?.itemType === "fuel" && <span> L</span>}
                    </div>
                    <span>{`Prix : ${formatPrice(selectedProduct && !isNaN(quantity) ? selectedProduct.price * quantity : 0, 3)}`}</span>
                </div>
            </Popup>
        </FetchWrapper>
    );
};

interface ThresholdModalProps {
    onConfirm: (threshold: RestockableItemDTO[]) => void;
}

const ThresholdsModal: FC<ThresholdModalProps> = ({onConfirm}) => {
    const {closeModal} = useModal();
    const [fuelOpen, setFuelOpen] = useState<boolean>(false);
    const [productOpen, setProductOpen] = useState<boolean>(false);

    const {data: thresholds, setData: setThresholds, loading, error} = useFetch<RestockableItemDTO[]>(apiUrl("/items/restockables"));

    const handleDeleteThreshold = (idItem: number) => {
        setThresholds(prev => prev
            ? prev.map(t => t.id === idItem
                ? {...t, alertThreshold: undefined, autoRestockQuantity: undefined}
                : t
            )
            : prev
        );
    };

    const handleAddThreshold = (idItem: number) => {
        setThresholds(prev => prev
            ? prev.map(t => t.id === idItem
                ? {...t, alertThreshold: 0, autoRestockQuantity: 0}
                : t
            )
            : prev
        );
    };

    const handleValueChange = (idItem: number, value: { threshold?: number, quantity?: number }) => {
        setThresholds(prev => prev
            ? prev.map(t => t.id === idItem
                ? {
                    ...t,
                    alertThreshold: value.threshold ?? t.alertThreshold,
                    autoRestockQuantity: value.quantity ?? t.autoRestockQuantity
                }
                : t
            )
            : prev
        );
    };

    return (
        <FetchWrapper loading={loading} error={error}>
            <Popup
                className="modal-thresholds"
                title="Seuils"
                footer={
                    <>
                        <button className="popup-btn cancel" onClick={closeModal}>
                            Annuler
                        </button>
                        <button
                            className="popup-btn validate"
                            onClick={() => {
                                onConfirm(thresholds ?? []);
                                closeModal();
                            }}
                        >
                            Enregistrer
                        </button>
                    </>
                }
            >
                {Object.entries({"product": "Produits", "fuel": "Carburants"}).map(([itemType, label]) => (
                    <div key={itemType} className={`dropdown-menu ${itemType === "product" && productOpen || itemType === "fuel" && fuelOpen ? "active" : ""}`}>
                        <span onClick={() => itemType === "product" ? setProductOpen(!productOpen) : setFuelOpen(!fuelOpen)}>
                            {label}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path d="M480-360 280-560h400L480-360Z"/>
                            </svg>
                        </span>
                        <div className="dropdown-content">
                            {thresholds && thresholds.map(threshold => threshold.itemType === itemType && (
                                <div key={threshold.id} className="threshold-item">
                                    <span>{threshold.name}</span>
                                    {threshold.autoRestockQuantity != null && threshold.alertThreshold != null
                                        ? (
                                            <>
                                                <div>
                                                    <div>
                                                        <label>Seuil</label>
                                                        <DecimalInput
                                                            nbDecimalPlaces={itemType === "product" ? 0 : 3}
                                                            initialValue={threshold.alertThreshold}
                                                            onChange={e => handleValueChange(threshold.id, {threshold: parseInt(e.target.value)})}
                                                        />
                                                        {threshold.itemType === "fuel" && <span>L</span>}
                                                    </div>

                                                    <div>
                                                        <label>Quantite</label>
                                                        <DecimalInput
                                                            nbDecimalPlaces={itemType === "product" ? 0 : 3}
                                                            initialValue={threshold.autoRestockQuantity}
                                                            onChange={e => handleValueChange(threshold.id, {quantity: parseInt(e.target.value)})}
                                                        />
                                                        {threshold.itemType === "fuel" && <span>L</span>}
                                                    </div>
                                                </div>
                                                <button className="action-btn" onClick={() => handleDeleteThreshold(threshold.id)}>Supprimer</button>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{padding: "8px"}}>Aucun seuil</span>
                                                <button className="action-btn" onClick={() => handleAddThreshold(threshold.id)}>Ajouter</button>
                                            </>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Popup>
        </FetchWrapper>
    );
};
