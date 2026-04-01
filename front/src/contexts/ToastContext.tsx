import { createContext, useCallback, useContext, useState, type FC, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    toasts: Toast[];
    push: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4000;

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const push = useCallback((message: string, type: ToastType = "info") => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    }, [dismiss]);

    const success = useCallback((message: string) => push(message, "success"), [push]);
    const error   = useCallback((message: string) => push(message, "error"),   [push]);

    return (
        <ToastContext.Provider value={{ toasts, push, success, error, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}
