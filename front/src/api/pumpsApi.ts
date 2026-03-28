import { apiUrl, fetchJsonWithAuth } from "./common.ts";

export type PumpStatus = "available" | "inUse" | "outOfOrder" | "deactivated";

export interface FuelLevel {
    type: string;
    currentLevel: number;
    maxLevel: number | null;
}

export interface PumpDTO {
    id: number;
    isAutomate: boolean;
    status: PumpStatus;
    enabled: boolean;
    inUseAt: string | null;
    fuelLevels: FuelLevel[];
}

export async function getPumps(): Promise<PumpDTO[]> {
    return fetchJsonWithAuth(apiUrl("/pumps"));
}

export async function togglePumpEnabled(id: number, enabled: boolean): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/pumps/${id}/enabled`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
    });
}

export async function updatePumpStatus(
    id: number,
    status: "available" | "inUse" | "outOfOrder" | "deactivated"
): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/pumps/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
}
