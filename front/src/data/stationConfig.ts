import type {ScreenConfig, Size, User, WidgetDef} from "../types";

export const USERS: User[] = [
    {username: "employe1", password: "1234", role: "employe", name: "Jean Dupont"},
    {username: "employe2", password: "1234", role: "employe", name: "Marie Martin"},
    {username: "gerant1", password: "admin", role: "gerant", name: "Paul Bernard"},
];

export const WIDGETS: Record<string, WidgetDef> = {
    chargeurs: {id: "chargeurs", label: "Chargeurs", icon: "🔌"},
    CCE: {id: "CCE", label: "CCE", icon: "💳"},
    ticket: {id: "ticket", label: "Ticket", icon: "🧾"},
    pompes: {id: "pompes", label: "Etat des Pompes", icon: "⛽"},
    historique_transactions: {id: "historique_transactions", label: "Historique transactions", icon: "😮"},
    calculatrice: {id: "calculatrice", label: "Calculatrice", icon: "🧮"},
    reapprovisionnements_employe: {id: "reapprovisionnements_employe", label: "Réapprovisionnements", icon: "🙏"},
    produits: {id: "produits", label: "Produits", icon: "🧈"},
    transactions: {id: "transactions", label: "Transactions", icon: "📅"},
    clients: {id: "clients", label: "Clients", icon: "😎"},
    reapprovisionnements_gerant: {id: "reapprovisionnements_gerant", label: "Réapprovisionnements", icon: "🙏", rows: 2},
    marchandises: {id: "marchandises", label: "Marchandises", icon: "⛈️"},
    table_transactions: {id: "table_transactions", label: "Table transactions", icon: "🍽️"},
    directives: {id: "directives", label: "Directives", icon: "🤬"},
    documents_de_gestion: {id: "documents_de_gestion", label: "Documents De Gestion", icon: "🐽"},
    incident: {id: "incident", label: "Incident", icon: "⛷️"},
};

export const SCREENS: Record<string, ScreenConfig> = {
    employe_1: {
        label: "Employe - Vue principale",
        defaultGrid: [["chargeurs", "CCE", "ticket"], ["pompes", "historique_transactions", "calculatrice"]],
    },
    employe_2: {
        label: "Employe - Vue simplifiee",
        defaultGrid: [["reapprovisionnements_employe", "produits"], ["transactions", "clients"]],
    },
    gerant_1: {
        label: "Gerant - Vue principale",
        defaultGrid: [["reapprovisionnements_gerant", "marchandises", "CCE"], [null, "transactions", "clients"]],
    },
    gerant_2: {
        label: "Gerant - Vue analytique",
        defaultGrid: [["table_transactions", "directives"], ["documents_de_gestion", "incident"]],
    },
};

export const buildGrid = (screenKey: string): (string | null)[][] => [...SCREENS[screenKey].defaultGrid];
export const isWide = (widgetId: string | null): boolean => widgetId !== null && Boolean(WIDGETS[widgetId]?.cols == 2);
export const getSize = (widgetId: string | null): Size => {
    if (widgetId === null) {
        return {width: 0, height: 0};
    }
    
    return {
        width: WIDGETS[widgetId]?.cols || 1, 
        height: WIDGETS[widgetId]?.rows || 1
    }
}