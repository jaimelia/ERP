// hooks/useFetch.ts
import {useState, useEffect, useCallback} from "react";
import * as React from "react";
import {fetchJsonWithAuth} from "../api/common.ts";

interface UseFetchResult<T> {
	data: T | null;
	setData: React.Dispatch<React.SetStateAction<T | null>>; // ← ajouter ça
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useFetch<T>(url: string, pollingInterval?: number): UseFetchResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async (): Promise<void> => {
		try {
			const result = await fetchJsonWithAuth(url);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		fetchData();
		if (!pollingInterval) return;
		const interval = setInterval(fetchData, pollingInterval);
		return () => clearInterval(interval);
	}, [fetchData, pollingInterval]);

	return { data, setData, loading, error, refetch: fetchData }; // ← exposer setData
}