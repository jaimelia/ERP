import {type ReactElement} from "react";

export type ThemeKey = "light" | "dark";
export type Role = "employe" | "gerant";

export interface User {
    username: string;
    password: string;
    role: Role;
    name: string;
}

export interface WidgetDef {
    id: string;
    label: string;
    size: Size;
    element?: ReactElement;
}

export interface ScreenConfig {
    label: string;
    defaultGrid: (string | null)[][];
}

export interface Coords {
    x: number;
    y : number;
}

export interface Size {
    width: number;
    height: number;
}

export const coordsToKey = (c: Coords): string => `${c.x},${c.y}`;
export const coordsEqual = (a: Coords | null, b: Coords | null): boolean =>
    a !== null && b !== null && a.x === b.x && a.y === b.y;

