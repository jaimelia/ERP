import { type FC, type ReactNode } from "react";

interface FetchWrapperProps {
	loading: boolean;
	error: string | null;
	children: ReactNode;
}

export const FetchWrapper: FC<FetchWrapperProps> = ({ loading, error, children }) => {
	if (loading) return (
		<div className="widget-state">
			<span className="spinner" />
			Chargement...
		</div>
	);
	if (error) return (
		<div className="widget-state widget-state--error">
			⚠️ {error}
		</div>
	);
	return <>{children}</>;
};