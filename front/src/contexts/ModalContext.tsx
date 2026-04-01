import {createContext, type FC, type ReactNode, useCallback, useContext, useMemo, useRef, useState,} from "react";
import {ModalOverlay} from "../components/modal/ModalOverlay.tsx";

interface OpenModalOptions {
    boxed?: boolean;
    onClose?: () => void;
}

interface CloseModalOptions {
    runOnClose?: boolean;
}

interface ModalContextValue {
    openModal: (content: ReactNode, options?: OpenModalOptions) => number;
    updateModal: (id: number, content: ReactNode) => void;
    closeModal: () => void;
    closeModalById: (id: number, options?: CloseModalOptions) => void;
}

interface ModalStackEntry {
    id: number;
    content: ReactNode;
    boxed: boolean;
    onClose?: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [stack, setStack] = useState<ModalStackEntry[]>([]);
    const nextIdRef = useRef<number>(1);

    const openModal = useCallback((content: ReactNode, options?: OpenModalOptions): number => {
        const id = nextIdRef.current;
        nextIdRef.current += 1;

        setStack(prev => [
            ...prev,
            {
                id,
                content,
                boxed: options?.boxed ?? true,
                onClose: options?.onClose,
            },
        ]);

        return id;
    }, []);

    const updateModal = useCallback((id: number, content: ReactNode): void => {
        setStack(prev =>
            prev.map(entry => (entry.id === id ? {...entry, content} : entry))
        );
    }, []);

    const closeModalById = useCallback((id: number, options?: CloseModalOptions): void => {
        const runOnClose = options?.runOnClose ?? true;

        setStack(prev => {
            const target = prev.find(entry => entry.id === id);
            if (!target) return prev;

            if (runOnClose) target.onClose?.();

            return prev.filter(entry => entry.id !== id);
        });
    }, []);

    const closeModal = useCallback((): void => {
        setStack(prev => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            last.onClose?.();
            return prev.slice(0, -1);
        });
    }, []);

    const value = useMemo<ModalContextValue>(
        () => ({openModal, updateModal, closeModal, closeModalById}),
        [openModal, updateModal, closeModal, closeModalById]
    );

    return (
        <ModalContext.Provider value={value}>
            {children}
            {stack.map((entry, index) => (
                <ModalOverlay
                    key={entry.id}
                    onClose={() => closeModalById(entry.id)}
                    isActive={index === stack.length - 1}
                    boxed={entry.boxed}
                >
                    {entry.content}
                </ModalOverlay>
            ))}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextValue => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal doit etre utilise dans un ModalProvider");
    return ctx;
};
