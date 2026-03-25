import { type FC, useEffect, useState } from "react";
import { getStock, deleteProduct, updateProduct, updateFuel, type StockItemDTO } from "../../api/merchandiseApi.ts";

export const Products: FC = () => {
    const [products, setProducts] = useState<StockItemDTO[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<StockItemDTO | null>(null);
    const [modalAction, setModalAction] = useState<string>("");
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editStock, setEditStock] = useState("");

    const load = async () => {
        const data = await getStock();
        setProducts(data);
    };

    useEffect(() => { load(); }, []);

    const openModal = (product: StockItemDTO, action: string) => {
        setSelectedProduct(product);
        setModalAction(action);
        setEditName(product.name);
        setEditPrice(String(product.price));
        setEditStock(String(product.stock));
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalAction("");
    };

    const confirmAction = async () => {
        if (!selectedProduct) return;
        if (modalAction === "edit") {
            if (selectedProduct.type === "Produit") {
                await updateProduct(selectedProduct.id, {
                    name: editName,
                    unitPrice: parseFloat(editPrice),
                    stock: parseInt(editStock),
                    alertThreshold: 0,
                });
            } else {
                await updateFuel(selectedProduct.id, {
                    name: editName,
                    pricePerLiter: parseFloat(editPrice),
                    stock: parseFloat(editStock),
                    alertThreshold: 0,
                });
            }
        } else if (modalAction === "delete" && selectedProduct.type === "Produit") {
            await deleteProduct(selectedProduct.id);
        }
        closeModal();
        await load();
    };

    const renderModal = () => {
        if (!selectedProduct) return null;

        const titre = modalAction === "edit" ? "Modifier le produit" : "Supprimer le produit";

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{titre}</h2>
                    {modalAction === "edit" ? (
                        <>
                            <input placeholder="Nom" value={editName} onChange={e => setEditName(e.target.value)} />
                            <input placeholder="Prix" type="number" step="0.001" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                            <input placeholder="Stock" type="number" step="0.001" value={editStock} onChange={e => setEditStock(e.target.value)} />
                        </>
                    ) : (
                        <p>Supprimer "{selectedProduct.name}" ?</p>
                    )}
                    <div className="modal-actions">
                        <button type="button" onClick={closeModal}>Annuler</button>
                        <button type="button" onClick={confirmAction}>Confirmer</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="widget-products">
            <div className="researchBar">
                <input type="text" placeholder="Rechercher une marchandise" />
                <select>
                    <option value="">Tous</option>
                    <option value="carburant">Carburants</option>
                    <option value="produit">Produit</option>
                </select>
            </div>

            <div className="products-list">
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité</th>
                            <th>Type</th>
                            <th>Prix</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.stock}{product.type === "Carburant" ? " L" : ""}</td>
                                <td>{product.type}</td>
                                <td>{product.price} {product.type === "Carburant" ? "€/L" : "€"}</td>
                                <td>
                                    <button type="button" onClick={() => openModal(product, "edit")}>Editer</button>
                                    {product.type === "Produit" && (
                                        <button type="button" onClick={() => openModal(product, "delete")}>Supprimer</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderModal()}
        </div>
    );
};
