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
    icon: string;
    cols?: number;
    rows?: number;
}

export interface ScreenConfig {
    cols: number;
    rows: number;
    label: string;
    defaultGrid: (string | null)[];
}
