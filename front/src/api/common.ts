import type {ApiError} from "../types.ts";

export const SERVER_URL = "http://localhost:8080";
export const apiUrl = (path: string): string => `${SERVER_URL}/api${path}`;

export function authHeaders(extra: HeadersInit = {}): Record<string, string> {
	const normalized: Record<string, string> = {};

	if (extra instanceof Headers) {
		extra.forEach((value, key) => { normalized[key] = value; });
	} else if (Array.isArray(extra)) {
		extra.forEach(([key, value]) => { normalized[key] = value; });
	} else {
		Object.assign(normalized, extra);
	}

	const token = window.localStorage.getItem("token");
	if (token) {
		normalized["Authorization"] = `Bearer ${token}`;
	}

	return normalized;
}

export async function fetchJsonWithAuth(url: string, options: RequestInit = {}) {
	const headers = authHeaders(options.headers || {});
	return fetchJson(url, {...options, headers});
}

export async function fetchJson(url: string, options: RequestInit = {}) {
	const response = await fetch(url, options);

	let body = null;
	const contentType = response.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		body = await response.json();
	}

	if (!response.ok) {
		if (response.status === 401) {
			window.localStorage.removeItem("token");
			window.location.reload();
		}

		throw {
			message: body?.message ?? "Erreur serveur",
			status: response.status,
			body: body
		} satisfies ApiError;
	}

	return body;
}