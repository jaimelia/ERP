import {apiUrl, fetchJsonWithAuth} from "./common.ts";
import type {DocumentStatus} from "./incidentsApi.ts";

export type {DocumentStatus};

export interface FuelReportLineDTO {
    fuelName: string;
    volumeDelivered: number;
    pricePerLiter: number;
    totalAmount: number;
}

export interface DailyReportSummaryDTO {
    id: number;
    reportDate: string; // "yyyy-MM-dd"
    transactionCount: number;
    totalAmount: number;
    status: DocumentStatus;
}

export interface DailyTransactionsReportDTO {
    id: number | null;
    reportDate: string;
    fuelLines: FuelReportLineDTO[];
    totalFuelVolume: number;
    totalElectricityVolume: number;
    totalElectricityAmount: number;
    totalProductVolume: number;
    totalProductsAmount: number;
    automatTransactionCount: number;
    cashierTransactionCount: number;
    transactionCount: number;
    totalFuelsAmount: number;
    totalAmount: number;
    status: DocumentStatus | null;
}

export async function getDailyReports(): Promise<DailyReportSummaryDTO[]> {
    return fetchJsonWithAuth(apiUrl("/daily-reports"), {});
}

export async function previewDailyReport(date: string): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/daily-reports/preview?date=${date}`), {});
}

export async function getDailyReportById(id: number): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/daily-reports/${id}`), {});
}

export async function createDailyReport(reportDate: string): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl("/daily-reports"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({reportDate}),
    });
}

export async function updateDailyReport(id: number): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/daily-reports/${id}`), {method: "PUT"});
}

export async function validateDailyReport(id: number): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/daily-reports/${id}/validate`), {method: "PATCH"});
}
