import {useModal} from "../../contexts/ModalContext";
import type {FC} from "react";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    danger?: boolean;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
                                                        title, message, confirmLabel = "Confirmer",
                                                        cancelLabel = "Annuler", onConfirm, danger = false
                                                    }) => {
    const {closeModal} = useModal();

    return (
        <div className="modal-content">
            <h2 className="modal-title">{title}</h2>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" onClick={closeModal}>
                    {cancelLabel}
                </button>
                <button
                    className={`modal-button ${danger ? "modal-button--danger" : "modal-button--confirm"}`}
                    onClick={() => {
                        onConfirm();
                        closeModal();
                    }}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};