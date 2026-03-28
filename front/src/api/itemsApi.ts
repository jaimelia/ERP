import {apiUrl, fetchJsonWithAuth} from "./common.ts";
import type {ItemType} from "../types.ts";

export interface UpdateProductDTO {
    name: string;
    price: number;
    stock: number;
}

export interface UpdateFuelDTO {
    name: string;
    price: number;
    stock: number;
}

export interface UpdateElectricityDTO {
    name: string;
    normalPrice: number;
    fastPrice: number;
}

export interface ItemDTO {
    id: number;
    name: string;
    stock: number;
	itemType: ItemType;
    price: number;
}

export interface ElectricityDTO {
    id: number;
    name: string;
    normalPrice: number;
    fastPrice: number;
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

export interface CreateRestockDTO {
	idItem: number;
	quantity: number;
}

export interface RestockableItemDTO {
	id: number;
	name: string;
	price: number;
	quantity: number;
	itemType: ItemType;
	alertThreshold?: number;
	autoRestockQuantity?: number;
}

export interface UpdateThresholdsDTO {
	idItem: number;
	alertThreshold: number | null;
	autoRestockQuantity: number | null;
}

/* restocks */
export async function createRestock(restock: CreateRestockDTO) {
	return await fetchJsonWithAuth(apiUrl("/restocks"), {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			idItem: restock.idItem,
			quantity: restock.quantity
		}),
	});
}

export async function updateThresholds(thresholds: UpdateThresholdsDTO[]) {
	return await fetchJsonWithAuth(apiUrl("/restocks/thresholds"), {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(thresholds),
	})
}

// ── Produits ──────────────────────────────────────────────────────────────────

export async function createProduct(dto: Omit<UpdateProductDTO, "id">): Promise<UpdateProductDTO> {
    return fetchJsonWithAuth(apiUrl("/items/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateProduct(id: number, dto: UpdateProductDTO): Promise<UpdateProductDTO> {
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

export async function createFuel(dto: UpdateFuelDTO): Promise<UpdateFuelDTO> {
    return fetchJsonWithAuth(apiUrl("/items/fuels"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateFuel(id: number, dto: UpdateFuelDTO): Promise<UpdateFuelDTO> {
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

export async function getStock(): Promise<ItemDTO[]> {
    return fetchJsonWithAuth(apiUrl("/items/stock"));
}

// electricity

export async function createElectricity(dto: UpdateElectricityDTO): Promise<ElectricityDTO> {
    return fetchJsonWithAuth(apiUrl("/items/electricity"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateElectricity(id: number, dto: UpdateElectricityDTO): Promise<ElectricityDTO> {
    return fetchJsonWithAuth(apiUrl(`/items/electricity/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteElectricity(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/items/electricity/${id}`), { method: "DELETE" });
}