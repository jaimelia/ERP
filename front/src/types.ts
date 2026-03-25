import {type ReactElement} from "react";
import {DEFAULT_LEVELS, WIDGETS} from "./data/stationConfig.tsx";

export type ThemeKey = "light" | "dark";
export type Role = "employe" | "gerant";
export type ItemType = "product" | "fuel";

export interface User {
    username: string;
	email: string;
    role: Role;
	usesDarkMode: boolean;
    tileLayout?: Levels;
}

export interface WidgetDef {
    id: string;
    label: string;
    size: Size;
    element?: ReactElement;
}

export interface Coords {
    x: number;
    y : number;
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
	tileLayout: Levels;
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
    }
}

export const formatPrice = (price: number, itemType?: ItemType): string => {
    switch (itemType) {
        case undefined:
        case "product":
            return `${price} €`;
        case "fuel":
            return `${price} €/L`;
    }
}