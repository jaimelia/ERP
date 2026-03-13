import type {ScreenConfig, Size, User, WidgetDef} from "../types";
import {Calculator} from "../components/Calculator.tsx";
import {Products} from "../components/Products.tsx";

export const USERS: User[] = [
    {username: "employe1", password: "1234", role: "employe", name: "Jean Dupont"},
    {username: "employe2", password: "1234", role: "employe", name: "Marie Martin"},
    {username: "gerant1", password: "admin", role: "gerant", name: "Paul Bernard"},
];

export const WIDGETS: Record<string, WidgetDef> = {
    chargeurs: {id: "chargeurs", label: "Chargeurs", size: {width: 1, height: 1}},
    CCE: {id: "CCE", label: "CCE", size: {width: 1, height: 1}},
    ticket: {id: "ticket", label: "Ticket", size: {width: 1, height: 1}},
    pompes: {id: "pompes", label: "Etat des Pompes", size: {width: 1, height: 1}},
    historique_transactions: {id: "historique_transactions", label: "Historique transactions", size: {width: 1, height: 1}},
    calculatrice: {id: "calculatrice", label: "Calculatrice", size: {width: 1, height: 1}, element: <Calculator />},
    reapprovisionnements_employe: {id: "reapprovisionnements_employe", label: "Réapprovisionnements", size: {width: 1, height: 1}},
    produits: {id: "produits", label: "Produits", size: {width: 1, height: 1}},
    transactions: {id: "transactions", label: "Transactions", size: {width: 1, height: 1}},
    clients: {id: "clients", label: "Clients", size: {width: 1, height: 1}},
    reapprovisionnements_gerant: {id: "reapprovisionnements_gerant", label: "Réapprovisionnements", size: {width: 1, height: 2}},
    marchandises: {id: "marchandises", label: "Marchandises", size: {width: 1, height: 1}, element: <Products />},
    table_transactions: {id: "table_transactions", label: "Table transactions", size: {width: 1, height: 1}},
    directives: {id: "directives", label: "Directives", size: {width: 1, height: 1}},
    documents_de_gestion: {id: "documents_de_gestion", label: "Documents De Gestion", size: {width: 1, height: 1}},
    incident: {id: "incident", label: "Incident", size: {width: 1, height: 1}},
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
export const getSize = (widgetId: string | null): Size => {
    if (widgetId === null) {
        return {width: 1, height: 1};
    }
    
    return WIDGETS[widgetId]?.size || {width: 1, height: 1};
}