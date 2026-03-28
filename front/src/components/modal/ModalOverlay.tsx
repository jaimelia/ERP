import {useEffect, type FC, type ReactNode} from "react";
import {createPortal} from "react-dom";

interface ModalOverlayProps {
    onClose: () => void;
    children: ReactNode;
}

export const ModalOverlay: FC<ModalOverlayProps> = ({onClose, children}) => {
    // Fermer avec Échap
    useEffect(() => {
        const handleKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body  // rendu en dehors du DOM du widget
    );
};