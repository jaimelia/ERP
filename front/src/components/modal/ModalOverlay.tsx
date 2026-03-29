import {useEffect, type FC, type ReactNode} from "react";
import {createPortal} from "react-dom";

interface ModalOverlayProps {
    onClose: () => void;
    children: ReactNode;
    isActive?: boolean;
}

export const ModalOverlay: FC<ModalOverlayProps> = ({onClose, children, isActive = true}) => {
    // Fermer avec Échap
    useEffect(() => {
        if (!isActive) return;
        const handleKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose, isActive]);

    return createPortal(
        <div
            className="modal-overlay"
            onClick={onClose}
            style={isActive ? undefined : {display: "none"}}
            aria-hidden={!isActive}
        >
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body  // rendu en dehors du DOM du widget
    );
};
