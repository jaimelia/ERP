import {createContext, useContext, useState, useCallback, type FC, type ReactNode} from "react";
import {ModalOverlay} from "../components/modal/ModalOverlay.tsx";

interface ModalContextValue {
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [stack, setStack] = useState<ReactNode[]>([]);

    const openModal = useCallback((content: ReactNode): void => {
        setStack(prev => [...prev, content]);
    }, []);

    const closeModal = useCallback((): void => {
        setStack(prev => prev.slice(0, -1));
    }, []);

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            {stack.map((content, index) => (
                <ModalOverlay
                    key={index}
                    onClose={closeModal}
                    isActive={index === stack.length - 1}
                >
                    {content}
                </ModalOverlay>
            ))}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextValue => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal doit être utilisé dans un ModalProvider");
    return ctx;
};
