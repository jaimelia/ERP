import type {Levels, Role, Size, WidgetDef, WidgetKey} from "../types";
import {CalculatorWidget} from "../components/widgets/CalculatorWidget.tsx";
import {CCEWidget} from "../components/widgets/CCEWidget.tsx";
import {CustomersWidget} from "../components/widgets/CustomersWidget.tsx";
import {ManagerRestockingWidget} from "../components/widgets/ManagerRestockingWidget.tsx";
import {TransactionsWidget} from "../components/widgets/TransactionsWidget.tsx";
import {ManagerProductsWidget} from "../components/widgets/ManagerProductsWidget.tsx";
import {ChargersWidget} from "../components/widgets/ChargersWidget.tsx";
import {PumpsWidget} from "../components/widgets/PumpsWidget.tsx";
import {TicketWidget} from "../components/widgets/TicketWidget.tsx";
import {GuidelinesWidget} from "../components/widgets/GuidelinesWidget.tsx";


export const WIDGETS: Record<string, WidgetDef> = {
	chargers: {id: "chargers", label: "Chargeurs", size: {width: 1, height: 1}, element: <ChargersWidget/>},
	CCE: {id: "CCE", label: "CCE", size: {width: 1, height: 1}, element: <CCEWidget/>},
	pumps: {id: "pumps", label: "Etat des Pompes", size: {width: 1, height: 1}, element: <PumpsWidget/>},
	ticket: {id: "ticket", label: "Ticket", size: {width: 1, height: 1}, element: <TicketWidget/>},
	transaction_history: {id: "transaction_history", label: "Historique transactions", size: {width: 1, height: 1}},
	calculator: {id: "calculator", label: "Calculatrice", size: {width: 1, height: 1}, element: <CalculatorWidget/>},
	employee_restocking: {id: "employee_restocking", label: "Réapprovisionnements", size: {width: 1, height: 1}},
	employee_products: {id: "employee_products", label: "Produits", size: {width: 1, height: 1}},
	transactions: {id: "transactions", label: "Transactions", size: {width: 1, height: 1}, element: <TransactionsWidget/>},
	customers: {id: "customers", label: "Clients", size: {width: 1, height: 1}, element: <CustomersWidget/>},
	manager_restocking: {id: "manager_restocking", label: "Réapprovisionnements", size: {width: 1, height: 2}, element: <ManagerRestockingWidget/>},
	manager_products: {id: "manager_products", label: "Marchandises", size: {width: 1, height: 1}, element: <ManagerProductsWidget/>},
	transaction_table: {id: "transaction_table", label: "Table transactions", size: {width: 1, height: 1}},
	guidelines: {id: "guidelines", label: "Directives Régionales", size: {width: 1, height: 1}, element: <GuidelinesWidget/>},
	management_documents: {id: "management_documents", label: "Documents De Gestion", size: {width: 1, height: 1}},
	incident: {id: "incident", label: "Incident", size: {width: 1, height: 1}},
};

export const DEFAULT_LEVELS: Record<Role, Levels> = {
	employe: [
		[["chargers", "CCE", "ticket"], ["pumps", "transaction_history", "calculator"]],
		[["employee_restocking", "employee_products"], ["transactions", "customers"]]
	],
	gerant: [
		[["manager_restocking", "manager_products", "CCE"], [null, "transactions", "customers"]],
		[["transaction_table", "guidelines"], ["management_documents", "incident"]]
	]
}

export const getSize = (widgetId: WidgetKey | null): Size => {
	if (widgetId === null) {
		return {width: 1, height: 1};
	}

	return WIDGETS[widgetId]?.size || {width: 1, height: 1};
}