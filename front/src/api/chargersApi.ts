import {apiUrl, fetchJsonWithAuth} from "./common.ts";
import type {PumpChargerStatus} from "./pumpsApi.ts";

export async function updateChargerStatus(id: number, status: PumpChargerStatus): Promise<void> {
    await fetchJsonWithAuth(apiUrl(`/chargers/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
}