import {createContext, useContext, useState, useCallback, type FC, type ReactNode} from "react";
import {ModalOverlay} from "../components/modal/ModalOverlay.tsx";

interface ModalContextValue {
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [content, setContent] = useState<ReactNode | null>(null);

    const openModal = useCallback((content: ReactNode): void => {
        setContent(content);
    }, []);

    const closeModal = useCallback((): void => {
        setContent(null);
    }, []);

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            {content && <ModalOverlay onClose={closeModal}>{content}</ModalOverlay>}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextValue => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal doit être utilisé dans un ModalProvider");
    return ctx;
};