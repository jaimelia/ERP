import { type FC } from "react";

interface TicketActionsProps {
    ticketStatus: number;
    onCancel: () => void;
    onValidate: () => void;
    isValidateDisabled: boolean;
    // Vous pouvez ajouter d'autres gestionnaires de paiement ici si nécessaire
    // onPayByCard?: () => void;
    // onPayByCash?: () => void;
    // onPayByCCE?: () => void;
}

export const TicketActions: FC<TicketActionsProps> = ({
    ticketStatus,
    onCancel,
    onValidate,
    isValidateDisabled,
    // onPayByCard,
    // onPayByCash,
    // onPayByCCE,
}) => {
    switch (ticketStatus) {
        case 0: // État initial : Annuler / Valider
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button" onClick={onCancel}>Annuler</button>
                    <button className="ticket-action-btn" type="button" onClick={onValidate} disabled={isValidateDisabled}>Valider</button>
                </div>
            );
        case 1: // État de sélection du paiement
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button">Carte Bancaire</button>
                    <button className="ticket-action-btn" type="button">Espèces</button>
                    <button className="ticket-action-btn" type="button" onClick={onCancel}>Annuler</button>
                    {/* Ajoutez un bouton "Retour" pour revenir à l'état 0 si nécessaire */}
                </div>
            );
        // Ajoutez d'autres cas pour les statuts suivants (traitement du paiement, succès, erreur, etc.)
        default:
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button" onClick={onCancel}>Annuler</button>
                </div>
            );
    }
};