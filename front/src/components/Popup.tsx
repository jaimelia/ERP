import {type FC, type ReactNode, useEffect, useRef} from "react";
import {useModal} from "../contexts/ModalContext.tsx";

interface PopupBaseProps {
    icon?: ReactNode;
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

interface ManagedPopupProps extends PopupBaseProps {
    isOpen: boolean;
    onClose: () => void;
}

type PopupProps = PopupBaseProps | ManagedPopupProps;

const PopupCard: FC<PopupBaseProps> = ({icon, title, subtitle, children, footer, className}) => {
    return (
        <div className={className ? `popup ${className}` : "popup"}>
            <div className="popup-header">
                {icon && <div className="popup-icon">{icon}</div>}
                <div className="popup-header-text">
                    <h3>{title}</h3>
                    {subtitle && <p>{subtitle}</p>}
                </div>
            </div>

            <div className="popup-body">
                {children}
            </div>

            {footer && (
                <div className="popup-actions">
                    {footer}
                </div>
            )}
        </div>
    );
};

const ManagedPopup: FC<ManagedPopupProps> = ({isOpen, onClose, icon, title, subtitle, children, footer, className}) => {
    const {openModal, updateModal, closeModalById} = useModal();
    const modalIdRef = useRef<number | null>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const popupContent = (
            <PopupCard
                icon={icon}
                title={title}
                subtitle={subtitle}
                footer={footer}
                className={className}
            >
                {children}
            </PopupCard>
        );

        if (isOpen) {
            if (modalIdRef.current === null) {
                modalIdRef.current = openModal(popupContent, {
                    boxed: false,
                    onClose: () => {
                        modalIdRef.current = null;
                        onCloseRef.current();
                    },
                });
            } else {
                updateModal(modalIdRef.current, popupContent);
            }
            return;
        }

        if (modalIdRef.current !== null) {
            closeModalById(modalIdRef.current, {runOnClose: false});
            modalIdRef.current = null;
        }
    }, [
        isOpen,
        icon,
        title,
        subtitle,
        children,
        footer,
        className,
        openModal,
        updateModal,
        closeModalById,
    ]);

    useEffect(() => {
        return () => {
            if (modalIdRef.current !== null) {
                closeModalById(modalIdRef.current, {runOnClose: false});
                modalIdRef.current = null;
            }
        };
    }, [closeModalById]);

    return null;
};

export const Popup: FC<PopupProps> = props => {
    if ("isOpen" in props) {
        return <ManagedPopup {...props} />;
    }
    return <PopupCard {...props} />;
};
