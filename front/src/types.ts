import {type ReactElement} from "react";
import {DEFAULT_LEVELS, WIDGETS} from "./data/stationConfig.tsx";

export type ThemeKey = "light" | "dark";
export type Role = "manager" | "employee";
export type ItemType = "product" | "fuel" | "electricity";
export type TicketStatus =
    "initial"
    | "paymentSelection"
    | "payingByCard"
    | "payingByCash"
    | "payingByCCE"
    | "processingCard"
    | "processingCash"
    | "validated";

export interface PaymentResponseDTO {
    paymentId: number | null;
    status: "VALIDATED" | "PARTIAL" | "CANCELED" | "EXCESS";
    amountRemaining: number;
    message: string;
}

export type TileLayouts = Record<Role, Levels>;
export type TileLayoutPayload = Levels | TileLayouts;

export interface User {
    username: string;
    email: string;
    role: Role;
    usesDarkMode: boolean;
    tileLayout?: TileLayoutPayload;
}

export interface WidgetDef {
    id: string;
    label: string;
    size: Size;
    element?: ReactElement;
}

export interface Coords {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface ApiError {
    message: string;
    status: number;
    body: unknown;
}

export interface UserPreferences {
    darkMode: boolean;
    tileLayout: TileLayouts;
}

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
    price: number;
    stock: number;
}

export interface ElectricityDTO {
    id: number;
    name: string;
    normalPrice: number;
    fastPrice: number;
}

export type TransactionItemDTO = ProductDTO | FuelDTO | ElectricityDTO;

export interface TransactionLineDTO {
    idTransactionLine: number;
    quantity: number;
    totalAmount: number;
    item: TransactionItemDTO | null;
}

export interface TransactionPaymentDTO {
    idTransactionPayment: number;
    paymentMethod: string;
    amount: number;
    endNumCard: string | null;
    status: string;
    date: string;
    idCceCard: number | null;
}

export interface TransactionDTO {
    idTransaction: number;
    type: string;
    transactionDate: string;
    isFromAutomat: boolean;
    status: string;
    lines: TransactionLineDTO[];
    payments: TransactionPaymentDTO[];
}

export const coordsToKey = (c: Coords): string => `${c.x},${c.y}`;
export const coordsEqual = (a: Coords | null, b: Coords | null): boolean =>
    a !== null && b !== null && a.x === b.x && a.y === b.y;

export type WidgetKey = keyof typeof WIDGETS

export type Levels = Grid[]

export type Grid = (WidgetKey | null)[][]

export function isWidgetKey(value: string): value is WidgetKey {
    return value in WIDGETS;
}

// checks if a Levels object has the size has the DEFAULT_LEVELS
export const isLayoutValid = (role: Role, levels?: Levels): boolean => {
    if (!levels || levels.length !== DEFAULT_LEVELS[role].length) { // same amount of levels
        return false;
    }

    let valid = true;
    for (let level = 0; level < levels.length; level++) {
        // same amount of row in current level
        if (!valid || levels[level].length !== DEFAULT_LEVELS[role][level].length) {
            valid = false;
            break;
        }

        for (let row = 0; row < levels[level].length; row++) {
            // same amount of widget in current row
            if (!valid || levels[level][row].length !== DEFAULT_LEVELS[role][level][row].length) {
                valid = false;
                break;
            }

            for (const widget of levels[level][row]) {
                if (widget !== null && !isWidgetKey(widget)) {
                    valid = false;
                    break;
                }
            }
        }
    }

    return valid;
}

export const formatQuantity = (quantity: number, itemType: ItemType): string => {
    switch (itemType) {
        case "fuel":
            return `${quantity} L`;
        case "product":
            return `${quantity}`;
        case "electricity":
            return `${quantity} kWh`;
    }
}

export const formatPrice = (price: number, decimalPlaces = 2, itemType?: ItemType): string => {
    switch (itemType) {
        case undefined:
        case "product":
            return `${price.toFixed(decimalPlaces)} €`;
        case "fuel":
            return `${price.toFixed(decimalPlaces)} €/L`;
        case "electricity":
            return `${price.toFixed(decimalPlaces)} €/kWh`
    }
}
