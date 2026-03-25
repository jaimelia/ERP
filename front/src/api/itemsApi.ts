import {apiUrl, fetchJsonWithAuth} from "./common.ts";

export interface ProductDTO {
    id: number;
    name: string;
    price: number;
    stock: number;
    alertThreshold: number;
}

export interface FuelDTO {
    id: number;
    name: string;
    price: number;
    stock: number;
    alertThreshold: number;
}

export interface StockItemDTO {
    type: "Produit" | "Carburant";
    id: number;
    name: string;
    stock: number;
    price: number;
    alertThreshold: number | null;
}

export interface RestockDTO {
    idRestock: number;
    quantity: number;
    restockDate: string;
    itemId: number;
    itemName: string;
    itemType: string;
    status: "pending" | "delivered" | "canceled";
}

export interface RestockableItemDTO {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export async function getRestockableItems(): Promise<RestockableItemDTO[]> {
    return fetchJsonWithAuth(apiUrl("/items/restockables"));
}

// ── Produits ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ProductDTO[]> {
    return fetchJsonWithAuth(apiUrl("/items/products"));
}

export async function createProduct(dto: Omit<ProductDTO, "id">): Promise<ProductDTO> {
    return fetchJsonWithAuth(apiUrl("/items/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateProduct(id: number, dto: Omit<ProductDTO, "id">): Promise<ProductDTO> {
    return fetchJsonWithAuth(apiUrl(`/items/products/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteProduct(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/items/products/${id}`), { method: "DELETE" });
}

// ── Carburants ────────────────────────────────────────────────────────────────

export async function getFuels(): Promise<FuelDTO[]> {
    return fetchJsonWithAuth(apiUrl("/items/fuels"));
}

export async function updateFuel(id: number, dto: Omit<FuelDTO, "id">): Promise<FuelDTO> {
    return fetchJsonWithAuth(apiUrl(`/items/fuels/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteFuel(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/items/fuels/${id}`), { method: "DELETE" });
}

// ── Stock combiné (Produits + Carburants) ─────────────────────────────────────

export async function getStock(): Promise<StockItemDTO[]> {
    return fetchJsonWithAuth(apiUrl("/items/stock"));
}

// ── Réapprovisionnements ──────────────────────────────────────────────────────

export async function getRestocks(): Promise<RestockDTO[]> {
    return fetchJsonWithAuth(apiUrl("/items/restocks"));
}

export async function createRestock(dto: Omit<RestockDTO, "idRestock" | "itemName" | "itemType">): Promise<RestockDTO> {
    return fetchJsonWithAuth(apiUrl("/items/restocks"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateRestock(id: number, dto: Omit<RestockDTO, "idRestock" | "itemName" | "itemType">): Promise<RestockDTO> {
    return fetchJsonWithAuth(apiUrl(`/items/restocks/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteRestock(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/items/restocks/${id}`), { method: "DELETE" });
}
