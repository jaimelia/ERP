import type {Role, TileLayoutPayload, User, UserPreferences} from "../types.ts";
import {apiUrl, fetchJsonWithAuth} from "./common.ts";

export interface AdminUserDTO {
	id: number;
	username: string;
	email: string;
	role: Role;
	usesDarkMode: boolean;
}

export interface CreateUserDTO {
	username: string;
	email: string;
	password: string;
	role: Role;
}

export interface UpdateUserDTO {
	username?: string;
	email?: string;
	password?: string;
	role?: Role;
}

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
	const parsedLayout: TileLayoutPayload | undefined = data.tileLayout
		? JSON.parse(data.tileLayout)
		: undefined;
	return {
		...data,
		tileLayout: parsedLayout,
	};
}

export async function getUsers(): Promise<AdminUserDTO[]> {
	return fetchJsonWithAuth(apiUrl("/users"));
}

export async function createUser(dto: CreateUserDTO): Promise<AdminUserDTO> {
	return fetchJsonWithAuth(apiUrl("/users"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(dto),
	});
}

export async function updateUser(id: number, dto: UpdateUserDTO): Promise<AdminUserDTO> {
	return fetchJsonWithAuth(apiUrl(`/users/${id}`), {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(dto),
	});
}

export async function deleteUser(id: number): Promise<void> {
	await fetchJsonWithAuth(apiUrl(`/users/${id}`), { method: "DELETE" });
}
