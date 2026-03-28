import type {User, UserPreferences} from "../types.ts";
import {apiUrl, fetchJsonWithAuth} from "./common.ts";

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
	await fetchJsonWithAuth(apiUrl("/user/preferences"), {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			darkMode: prefs.darkMode,
			tileLayout: prefs.tileLayout
				? JSON.stringify(prefs.tileLayout)
				: undefined,
		}),
	});
}

export async function getMe(): Promise<User> {
	const data = await fetchJsonWithAuth(apiUrl("/user/me"));
	return {
		...data,
		tileLayout: data.tileLayout ? JSON.parse(data.tileLayout) : {},
	};
}