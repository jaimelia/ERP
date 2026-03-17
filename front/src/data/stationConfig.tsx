import type {ScreenConfig, Size, User, WidgetDef} from "../types";
import {Calculator} from "../components/widgets/Calculator.tsx";
import {CCEWidget} from "../components/widgets/CCEWidget.tsx";
import {CustomersWidget} from "../components/widgets/CustomersWidget.tsx";
import {ManagerRestockingWidget} from "../components/widgets/ManagerRestockingWidget.tsx";
import {TransactionsWidget} from "../components/widgets/TransactionsWidget.tsx";
import {ManagerProductsWidget} from "../components/widgets/ManagerProductsWidget.tsx";

export const USERS: User[] = [
    {username: "employe1", password: "1234", role: "employe", name: "Jean Dupont"},
    {username: "employe2", password: "1234", role: "employe", name: "Marie Martin"},
    {username: "gerant1", password: "admin", role: "gerant", name: "Paul Bernard"},
];

export const WIDGETS: Record<string, WidgetDef> = {
    chargers: {id: "chargers", label: "Chargeurs", size: {width: 1, height: 1}},
    CCE: {id: "CCE", label: "CCE", size: {width: 1, height: 1}, element: <CCEWidget />},
    ticket: {id: "ticket", label: "Ticket", size: {width: 1, height: 1}},
    pumps: {id: "pumps", label: "Etat des Pompes", size: {width: 1, height: 1}},
    transaction_history: {id: "transaction_history", label: "Historique transactions", size: {width: 1, height: 1}},
    calculator: {id: "calculator", label: "Calculatrice", size: {width: 1, height: 1}, element: <Calculator />},
    employee_restocking: {id: "employee_restocking", label: "Réapprovisionnements", size: {width: 1, height: 1}},
    employee_products: {id: "employee_products", label: "Produits", size: {width: 1, height: 1}},
    transactions: {id: "transactions", label: "Transactions", size: {width: 1, height: 1}, element: <TransactionsWidget />},
    customers: {id: "customers", label: "Clients", size: {width: 1, height: 1}, element: <CustomersWidget />},
    manager_restocking: {id: "manager_restocking", label: "Réapprovisionnements", size: {width: 1, height: 2}, element: <ManagerRestockingWidget />},
    manager_products: {id: "manager_products", label: "Marchandises", size: {width: 1, height: 1}, element: <ManagerProductsWidget />},
    transaction_table: {id: "transaction_table", label: "Table transactions", size: {width: 1, height: 1}},
    guidelines: {id: "guidelines", label: "Directives", size: {width: 1, height: 1}},
    management_documents: {id: "management_documents", label: "Documents De Gestion", size: {width: 1, height: 1}},
    incident: {id: "incident", label: "Incident", size: {width: 1, height: 1}},
};

export const SCREENS: Record<string, ScreenConfig> = {
    employe_1: {
        label: "Employe - Vue principale",
        defaultGrid: [["chargers", "CCE", "ticket"], ["pumps", "transaction_history", "calculator"]],
    },
    employe_2: {
        label: "Employe - Vue simplifiee",
        defaultGrid: [["employee_restocking", "employee_products"], ["transactions", "customers"]],
    },
    gerant_1: {
        label: "Gerant - Vue principale",
        defaultGrid: [["manager_restocking", "manager_products", "CCE"], [null, "transactions", "customers"]],
    },
    gerant_2: {
        label: "Gerant - Vue analytique",
        defaultGrid: [["transaction_table", "guidelines"], ["management_documents", "incident"]],
    },
};

export const buildGrid = (screenKey: string): (string | null)[][] => [...SCREENS[screenKey].defaultGrid];
export const getSize = (widgetId: string | null): Size => {
    if (widgetId === null) {
        return {width: 1, height: 1};
    }
    
    return WIDGETS[widgetId]?.size || {width: 1, height: 1};
}