import type {Levels, Role, Size, WidgetDef, WidgetKey} from "../types";
import {CalculatorWidget} from "../components/widgets/CalculatorWidget.tsx";
import {ManagerCCEWidget} from "../components/widgets/ManagerCCEWidget.tsx";
import {CustomersWidget} from "../components/widgets/CustomersWidget.tsx";
import {ManagerRestockWidget} from "../components/widgets/ManagerRestockWidget.tsx";
import {TransactionsWidget} from "../components/widgets/TransactionsWidget.tsx";
import {ManagerProductsWidget} from "../components/widgets/ManagerProductsWidget.tsx";
import {ChargersWidget} from "../components/widgets/ChargersWidget.tsx";
import {PumpsWidget} from "../components/widgets/PumpsWidget.tsx";
import {TicketWidget} from "../components/widgets/TicketWidget.tsx";
import {GuidelinesWidget} from "../components/widgets/GuidelinesWidget.tsx";
import {IncidentWidget} from "../components/widgets/IncidentWidget.tsx";
import {ManagementDocumentsWidget} from "../components/widgets/ManagementDocumentsWidget.tsx";
import {DailyTransactionsReportWidget} from "../components/widgets/DailyTransactionsReportWidget.tsx";
import {EmployeeRestockWidget} from "../components/widgets/EmployeeRestockWidget.tsx";
import {EmployeeProductsWidget} from "../components/widgets/EmployeeProductsWidget.tsx";
import {EmployeeCCEWidget} from "../components/widgets/EmployeeCCEWidget.tsx";


export const WIDGETS: Record<string, WidgetDef> = {
	chargers: {id: "chargers", label: "Chargeurs", size: {width: 1, height: 1}, element: <ChargersWidget/>},
	manager_cce: {id: "manager_cce", label: "CCE", size: {width: 1, height: 1}, element: <ManagerCCEWidget/>},
    employee_cce: {id: "employee_cce", label: "CCE", size: {width: 1, height: 1}, element: <EmployeeCCEWidget/>},
	pumps: {id: "pumps", label: "Etat des Pompes", size: {width: 1, height: 1}, element: <PumpsWidget/>},
	ticket: {id: "ticket", label: "Ticket", size: {width: 1, height: 1}, element: <TicketWidget/>},
	transaction_history: {id: "transaction_history", label: "Historique transactions", size: {width: 1, height: 1}},
	calculator: {id: "calculator", label: "Calculatrice", size: {width: 1, height: 1}, element: <CalculatorWidget/>},
	employee_restocking: {id: "employee_restocking", label: "Réapprovisionnements", size: {width: 1, height: 1}, element: <EmployeeRestockWidget/>},
	employee_products: {id: "employee_products", label: "Produits", size: {width: 1, height: 1}, element: <EmployeeProductsWidget />},
	transactions: {id: "transactions", label: "Transactions", size: {width: 1, height: 1}, element: <TransactionsWidget/>},
	customers: {id: "customers", label: "Clients", size: {width: 1, height: 1}, element: <CustomersWidget/>},
	manager_restocking: {id: "manager_restocking", label: "Réapprovisionnements", size: {width: 1, height: 2}, element: <ManagerRestockWidget/>},
	manager_products: {id: "manager_products", label: "Marchandises", size: {width: 1, height: 1}, element: <ManagerProductsWidget/>},
	transaction_table: {id: "transaction_table", label: "Table transactions", size: {width: 1, height: 1}, element: <DailyTransactionsReportWidget/>},
	guidelines: {id: "guidelines", label: "Directives Régionales", size: {width: 1, height: 1}, element: <GuidelinesWidget/>},
	management_documents: {id: "management_documents", label: "Documents De Gestion", size: {width: 1, height: 1}, element: <ManagementDocumentsWidget/>},
	incident: {id: "incident", label: "Incident", size: {width: 1, height: 1}, element: <IncidentWidget/>},
};

export const DEFAULT_LEVELS: Record<Role, Levels> = {
	employee: [
		[["chargers", "employee_cce", "ticket"], ["pumps", "transaction_history", "calculator"]],
		[["employee_restocking", "employee_products"], ["transactions", "customers"]]
	],
	manager: [
		[["manager_restocking", "manager_products", "manager_cce"], [null, "transactions", "customers"]],
		[["transaction_table", "guidelines"], ["management_documents", "incident"]]
	]
}

export const getSize = (widgetId: WidgetKey | null): Size => {
	if (widgetId === null) {
		return {width: 1, height: 1};
	}

	return WIDGETS[widgetId]?.size || {width: 1, height: 1};
}