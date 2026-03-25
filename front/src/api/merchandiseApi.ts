import { apiUrl, fetchJsonWithAuth } from "./common.ts";

export interface ProductDTO {
    idItem: number;
    name: string;
    unitPrice: number;
    stock: number;
    alertThreshold: number;
}

export interface FuelDTO {
    idItem: number;
    name: string;
    pricePerLiter: number;
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

// ── Produits ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ProductDTO[]> {
    return fetchJsonWithAuth(apiUrl("/merchandise/products"));
}

export async function createProduct(dto: Omit<ProductDTO, "idItem">): Promise<ProductDTO> {
    return fetchJsonWithAuth(apiUrl("/merchandise/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateProduct(id: number, dto: Omit<ProductDTO, "idItem">): Promise<ProductDTO> {
    return fetchJsonWithAuth(apiUrl(`/merchandise/products/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteProduct(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/merchandise/products/${id}`), { method: "DELETE" });
}

// ── Carburants ────────────────────────────────────────────────────────────────

export async function getFuels(): Promise<FuelDTO[]> {
    return fetchJsonWithAuth(apiUrl("/merchandise/fuels"));
}

export async function updateFuel(id: number, dto: Omit<FuelDTO, "idItem">): Promise<FuelDTO> {
    return fetchJsonWithAuth(apiUrl(`/merchandise/fuels/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteFuel(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/merchandise/fuels/${id}`), { method: "DELETE" });
}

// ── Stock combiné (Produits + Carburants) ─────────────────────────────────────

export async function getStock(): Promise<StockItemDTO[]> {
    return fetchJsonWithAuth(apiUrl("/merchandise/stock"));
}

// ── Réapprovisionnements ──────────────────────────────────────────────────────

export async function getRestocks(): Promise<RestockDTO[]> {
    return fetchJsonWithAuth(apiUrl("/merchandise/restocks"));
}

export async function createRestock(dto: Omit<RestockDTO, "idRestock" | "itemName" | "itemType">): Promise<RestockDTO> {
    return fetchJsonWithAuth(apiUrl("/merchandise/restocks"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateRestock(id: number, dto: Omit<RestockDTO, "idRestock" | "itemName" | "itemType">): Promise<RestockDTO> {
    return fetchJsonWithAuth(apiUrl(`/merchandise/restocks/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteRestock(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/merchandise/restocks/${id}`), { method: "DELETE" });
}
