import {apiUrl, fetchJsonWithAuth} from "./common.ts";

export type DocumentStatus = "pending" | "sentToDR" | "locked";

export interface IncidentReportDTO {
    id: number | null;
    type: string;
    date: string; // ISO datetime: "2026-02-13T12:26:00"
    technicalDetail: string;
    resolution: string;
    status: DocumentStatus;
}

export interface CreateIncidentDTO {
    type: string;
    date: string;
    technicalDetail: string;
    resolution: string;
}

export async function getIncidents(): Promise<IncidentReportDTO[]> {
    return fetchJsonWithAuth(apiUrl("/incidents"));
}

export async function createIncident(dto: CreateIncidentDTO): Promise<IncidentReportDTO> {
    return fetchJsonWithAuth(apiUrl("/incidents"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dto),
    });
}

export async function updateIncident(id: number, dto: IncidentReportDTO): Promise<IncidentReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/incidents/${id}`), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dto),
    });
}

export async function deleteIncident(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/incidents/${id}`), {method: "DELETE"});
}

export async function sendIncident(id: number): Promise<IncidentReportDTO> {
    return fetchJsonWithAuth(apiUrl(`/incidents/${id}/send`), {method: "PATCH"});
}
