import {type FC, useEffect, useState} from "react";

interface Product {
    nom : string;
    type : string;
    quantity: number;
    price: number;
}

export const Products: FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("la url");
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts()
    }, [])

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
                    <option value={""}>Carburants</option>
                    <option value={""}>Produit</option>
                </select>
            </div>


        </div>
    );
}