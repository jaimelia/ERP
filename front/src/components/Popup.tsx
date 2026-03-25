import type { FC, ReactNode } from "react";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    icon?: ReactNode;
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
}

export const Popup: FC<PopupProps> = ({ isOpen, onClose, icon, title, subtitle, children, footer }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup">
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
        </div>
    );
};