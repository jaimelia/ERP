export const SERVER_URL = "http://localhost:8080";
export const apiUrl = (path: string): string => `${SERVER_URL}/api${path}`;