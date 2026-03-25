import {type FC, useState} from "react";
import {useModal} from "../../context/ModalContext.tsx";
import {formatPrice, formatQuantity, type ItemType} from "../../types.ts";
import {type RestockableItemDTO} from "../../api/itemsApi.ts";
import {useFetch} from "../../hooks/useFetch.ts";
import {apiUrl} from "../../api/common.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";

interface NewRestockModalProps {
    onConfirm: (product: Product, quantity: number) => void;
}

interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
    itemType: ItemType;
}

const mockProducts: Product[] = [
    {id: 1, name: "Sans plomb 95", quantity: 1200, itemType: "fuel", price: 1.750},
    {id: 2, name: "Stylo bille BIC", quantity: 196, itemType: "product", price: 1.57},
    {id: 3, name: "Essuie-glace", quantity: 15, itemType: "product", price: 24.50},
    {id: 4, name: "Lave-glace", quantity: 28, itemType: "product", price: 9.90},
    {id: 5, name: "Arbre magique", quantity: 37, itemType: "product", price: 0.99},
];

export const NewRestockModal: FC<NewRestockModalProps> = ({onConfirm}) => {
    const {closeModal} = useModal();
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [quantity, setQuantity] = useState<number>(0);
    const [search, setSearch] = useState<string>()
    
    const {data: restockables, loading, error} = useFetch<RestockableItemDTO[]>(apiUrl("/items/restockables"));
    
    const filtered = !restockables ? [] : restockables.filter(product => 
        !search || product.name.trim().toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="modal-content">
                <h2>Nouveau réapprovisionnement</h2>
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
                <div className="products-list">
                    {filtered.map(product => (
                        <div
                            key={product.id}
                            className={`product-item ${selectedProduct?.id === product.id ? "selected" : ""}`}
                            onClick={() => selectedProduct?.id === product.id
                                ? setSelectedProduct(undefined)
                                : setSelectedProduct(product)}
                        >
                            <span>{product.name}</span>
                            <span>{`Stock : ${formatQuantity(product.quantity, product.itemType)}`}</span>
                        </div>
                    ))}
                </div>
                <div className="modal-options">
                    <div>
                        <label htmlFor="quantity">Quantité</label>
                        <input
                            type="number"
                            id="quantity"
                            min={0}
                            onChange={e => setQuantity(parseInt(e.target.value))}
                        />
                    </div>
                    <span>{`Prix : ${formatPrice(selectedProduct && !isNaN(quantity) ? selectedProduct.price * quantity : 0)}`}</span>
                </div>
                <div className="modal-actions">
                    <button className="modal-button modal-button--cancel" onClick={closeModal}>
                        Annuler
                    </button>
                    <button
                        className="modal-button modal-button--confirm"
                        onClick={() => {
                            onConfirm(selectedProduct!, quantity);
                            closeModal();
                        }}
                        disabled={selectedProduct === undefined || quantity === 0}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </FetchWrapper>
    );
};