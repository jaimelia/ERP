import {useModal} from "../../contexts/ModalContext";
import type {FC} from "react";
import {Popup} from "../Popup.tsx";

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
        <Popup
            title={title}
            footer={
                <>
                    <button className="popup-btn cancel" onClick={closeModal}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`popup-btn ${danger ? "warning" : "validate"}`}
                        onClick={() => {
                            onConfirm();
                            closeModal();
                        }}
                    >
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <p className="modal-message">{message}</p>
        </Popup>
    );
};
