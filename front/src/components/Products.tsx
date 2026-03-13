import {type FC, useEffect, useState} from "react";

interface Product {
    nom : string;
    type : string;
    quantity: number;
    price: number;
}

export const Products: FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalAction, setModalAction] = useState<string>("");

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("la url");
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts()
    }, []);

    const openModal = (product: Product, action: string) => {
        setSelectedProduct(product);
        setModalAction(action);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalAction("");
    };

    const renderModal = () => {
        if (selectedProduct === null) {
            return null;
        }

        let titre = "";
        if (modalAction === "edit") {
            titre = "Modifier le produit";
        } else if (modalAction === "delete") {
            titre = "Supprimer le produit";
        }

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{titre}</h2>
                    <p>Produit sélectionné : {"caca"}</p>

                    <div className="modal-actions">
                        <button type="button" onClick={closeModal}>Annuler</button>
                        <button type="button">Confirmer</button>
                    </div>
                </div>
            </div>
        );
    };
     // const handleFilterChange = () =>{}

    return (
        <div className={"widget-products"}>
            <div className={"researchBar"}>
                <input
                    type={"text"}
                    placeholder={"Rechercher une marchandise"}
                    // onChange={(e) => handleFilterChange()}
                />

                <select>
                    <option value={""}>Tous</option>
                    <option value={"carburant"}>Carburants</option>
                    <option value={"produit"}>Produit</option>
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
                    <tr key={1}>
                        <td>{"Sans plomb 95"}</td>
                        <td>{1667}{"L"}</td>
                        <td>{"Carburant"}</td>
                        <td>{1.667} {"€/L"}</td>
                        <td>
                            <button type="button" onClick={() => openModal(products[1], "edit")}>Editer</button>
                            <button type="button" onClick={() => openModal(products[1], "delete")}>Supprimer</button>
                        </td>
                    </tr>
                    {products.map((product, index) => {
                        let uniteQuantite = "";
                        let unitePrix = "€";

                        if (product.type === "Carburant") {
                            uniteQuantite = "L";
                            unitePrix = "€/L";
                        }

                        return (
                            <tr key={index}>
                                <td>{product.nom}</td>
                                <td>{product.quantity}{uniteQuantite}</td>
                                <td>{product.type}</td>
                                <td>{product.price} {unitePrix}</td>
                                <td>
                                    <button type="button">Editer</button>
                                    <button type="button">Supprimer</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {renderModal()}
        </div>
    );
}