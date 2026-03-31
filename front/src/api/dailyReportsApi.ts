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

export interface DailyReportRequestDTO {
    reportDate: string;
    totalFuelVolume: number;
    totalFuelsAmount: number;
    totalElectricityVolume: number;
    totalElectricityAmount: number;
    totalProductVolume: number;
    totalProductsAmount: number;
    automatTransactionCount: number;
    cashierTransactionCount: number;
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

export async function createDailyReport(request: DailyReportRequestDTO): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl("/daily-reports"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
    });
}

export async function updateDailyReport(id: number, request: DailyReportRequestDTO): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/daily-reports/${id}`), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
    });
}

export async function validateDailyReport(id: number): Promise<DailyTransactionsReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/daily-reports/${id}/validate`), {method: "PATCH"});
}
