import {type FC, type ReactNode, useEffect} from "react";
import {createPortal} from "react-dom";

interface ModalOverlayProps {
    onClose: () => void;
    children: ReactNode;
    isActive?: boolean;
    boxed?: boolean;
}

export const ModalOverlay: FC<ModalOverlayProps> = ({onClose, children, isActive = true, boxed = true}) => {
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
            className="modal-overlay popup-overlay"
            onClick={onClose}
            style={isActive ? undefined : {display: "none"}}
            aria-hidden={!isActive}
        >
            <div
                className={boxed ? "modal-box" : "modal-unboxed"}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};
