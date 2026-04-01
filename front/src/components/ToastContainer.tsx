import { type FC } from "react";
import { useToast, type Toast } from "../contexts/ToastContext.tsx";
import "../styles/toast.css";

const ICONS: Record<Toast["type"], string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
};

export const ToastContainer: FC = () => {
    const { toasts, dismiss } = useToast();

    return (
        <div className="toast-stack" aria-live="polite" aria-atomic="false">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast--${t.type}`} role="alert">
                    <span className="toast-icon">{ICONS[t.type]}</span>
                    <span className="toast-message">{t.message}</span>
                    <button
                        className="toast-close"
                        type="button"
                        aria-label="Fermer"
                        onClick={() => dismiss(t.id)}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};
