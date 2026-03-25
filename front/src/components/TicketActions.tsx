import {type FC, type SubmitEvent} from "react";
import DecimalInput from "./DecimalInput.tsx"
import type {TicketStatus} from "../types.ts";

interface TicketActionsProps {
    ticketStatus: TicketStatus;
    onCancelTicket: () => void;
    onCancelPayment: () => void;
    onValidate: () => void;
    isValidateDisabled: boolean;
    onPayByCard: (e: SubmitEvent<HTMLFormElement>) => void;
    onPayByCash: (e: SubmitEvent<HTMLFormElement>) => void;
    setTicketStatus: (status: TicketStatus) => void;
    // onPayByCCE?: () => void;
}

export const TicketActions: FC<TicketActionsProps> = ({
    ticketStatus,
    onCancelTicket,
    onCancelPayment,
    onValidate,
    isValidateDisabled,
    onPayByCard,
    onPayByCash,
    setTicketStatus,
    // onPayByCCE,
}) => {
    switch (ticketStatus) {
        case "initial": // État initial : Annuler / Valider
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button" onClick={onCancelTicket}>Annuler</button>
                    <button className="ticket-action-btn" type="button" onClick={onValidate} disabled={isValidateDisabled}>Valider</button>
                </div>
            );
        case "paymentSelection": // État de sélection du paiement
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button" onClick={() => setTicketStatus("payingByCard")}>Carte Bancaire</button>
                    <button className="ticket-action-btn" type="button" onClick={() => setTicketStatus("payingByCash")}>Espèces</button>
                    <button className="ticket-action-btn" type="button" onClick={onCancelTicket}>Annuler</button>
                </div>
            );
        case "payingByCard":
            return (
                    <form onSubmit={onPayByCard}>
                        <div className="ticket-payment-actions">
                            <button className="ticket-action-btn" type="button" onClick={onCancelTicket}>Annuler</button>
                            <DecimalInput />
                            <button className="ticket-action-btn" type="submit" >Valider</button>
                        </div>
                    </form>
            );
        case "payingByCash":
            return (
                <form onSubmit={onPayByCash}>
                    <div className="ticket-payment-actions">
                        <button className="ticket-action-btn" type="button" onClick={onCancelTicket}>Annuler</button>
                        <DecimalInput />
                        <button className="ticket-action-btn" type="submit" >Valider</button>
                    </div>
                </form>
            );
        case "processingCard":
            return (
                <div className="ticket-actions">
                    <p>Paiement en cours...</p>
                    {setTimeout(() => {setTicketStatus("initial")}, 5000)}
                </div>
            );
        case "processingCash":
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button" onClick={onCancelPayment}>Annuler</button>
                    <button className="ticket-action-btn" type="button" onClick={() => setTicketStatus("initial")}>Valider</button>
                </div>
            );

        default:
            return (
                <div className="ticket-actions">
                    <button className="ticket-action-btn" type="button" onClick={onCancelTicket}>Annuler</button>
                </div>
            );
    }
};