import {apiUrl, fetchJsonWithAuth} from "./common.ts";
import type {DocumentStatus} from "./incidentsApi.ts";

export type {DocumentStatus};

export interface ManagementDocumentDTO {
    id: number | null;
    name: string;
    lastModified: string | null; // ISO datetime: "2026-02-18T14:15:00"
    content: string | null;
    status: DocumentStatus;
}

export async function getManagementDocuments(): Promise<ManagementDocumentDTO[]> {
    return fetchJsonWithAuth(apiUrl("/management-documents"));
}

export async function createManagementDocument(name: string, content: string): Promise<ManagementDocumentDTO> {
    return fetchJsonWithAuth(apiUrl("/management-documents"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, content}),
    });
}

export async function importManagementDocument(file: File): Promise<ManagementDocumentDTO> {
    const formData = new FormData();
    formData.append("file", file);
    return fetchJsonWithAuth(apiUrl("/management-documents/import"), {
        method: "POST",
        body: formData,
        // Pas de Content-Type : le navigateur le génère automatiquement avec le boundary multipart
    });
}

export async function updateManagementDocument(
    id: number,
    name: string,
    content: string,
): Promise<ManagementDocumentDTO> {
    return fetchJsonWithAuth(apiUrl(`/management-documents/${id}`), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, content}),
    });
}

export async function sendManagementDocument(id: number): Promise<ManagementDocumentDTO> {
    return fetchJsonWithAuth(apiUrl(`/management-documents/${id}/send`), {method: "PATCH"});
}

export async function deleteManagementDocument(id: number): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/management-documents/${id}`), {method: "DELETE"});
}
