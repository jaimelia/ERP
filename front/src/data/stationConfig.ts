import type {ScreenConfig, User, WidgetDef} from "../types";

export const USERS: User[] = [
    {username: "employe1", password: "1234", role: "employe", name: "Jean Dupont"},
    {username: "employe2", password: "1234", role: "employe", name: "Marie Martin"},
    {username: "gerant1", password: "admin", role: "gerant", name: "Paul Bernard"},
];

export const WIDGETS: Record<string, WidgetDef> = {
    pompes: {id: "pompes", label: "Etat des Pompes", icon: "⛽", color: "#3B82F6"},
    transactions: {id: "transactions", label: "Transactions", icon: "💳", color: "#10B981"},
    stock: {id: "stock", label: "Stock Carburant", icon: "🛢️", color: "#F59E0B"},
    caisse: {id: "caisse", label: "Caisse", icon: "🏧", color: "#8B5CF6"},
    alertes: {id: "alertes", label: "Alertes", icon: "🔔", color: "#EF4444"},
    clients: {id: "clients", label: "File d'attente", icon: "👥", color: "#06B6D4"},
    stats: {id: "stats", label: "Statistiques du jour", icon: "📊", color: "#E85D04"},
    chiffre: {id: "chiffre", label: "Chiffre d'affaires", icon: "💰", color: "#10B981"},
    employes: {id: "employes", label: "Employes en service", icon: "👤", color: "#8B5CF6"},
    planning: {id: "planning", label: "Planning", icon: "📅", color: "#3B82F6"},
    fournisseurs: {id: "fournisseurs", label: "Fournisseurs", icon: "🚛", color: "#F59E0B"},
    rapport: {id: "rapport", label: "Rapport Etendu", icon: "📋", color: "#EF4444", wide: true},
    maintenance: {id: "maintenance", label: "Maintenance", icon: "🔧", color: "#06B6D4"},
    prix: {id: "prix", label: "Gestion des Prix", icon: "🏷️", color: "#EC4899"},
};

export const SCREENS: Record<string, ScreenConfig> = {
    employe_1: {
        cols: 3,
        rows: 2,
        label: "Employe - Vue principale",
        defaultGrid: ["chargeurs", "CCE", "ticket", "pompes", "historique transactions", "calculatrice"],
    },
    employe_2: {
        cols: 2,
        rows: 2,
        label: "Employe - Vue simplifiee",
        defaultGrid: ["réapprovisionnements", "produits", "transactions", "clients"],
    },
    gerant_1: {
        cols: 3,
        rows: 2,
        label: "Gerant - Vue principale",
        defaultGrid: ["transactions", "marchandises", "CCE", "vide", "réapprovisionnements", "clients"],
    },
    gerant_2: {
        cols: 2,
        rows: 2,
        label: "Gerant - Vue analytique",
        defaultGrid: ["table transactions", "directives", "documents de gestion", "incident"],
    },
};

export const buildGrid = (screenKey: string): (string | null)[] => [...SCREENS[screenKey].defaultGrid];
export const isWide = (widgetId: string | null): boolean => widgetId !== null && Boolean(WIDGETS[widgetId]?.wide);
