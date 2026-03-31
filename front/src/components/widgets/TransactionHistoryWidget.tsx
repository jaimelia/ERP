import { type FC } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import { FetchWrapper } from "../FetchWrapper.tsx";
import { type TransactionDTO, type TransactionLineDTO, type TransactionPaymentDTO } from "../../types.ts";
import { apiUrl } from "../../api/common.ts";
import { useModal } from "../../contexts/ModalContext.tsx";

// ── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatPaymentMethod = (method: string) => {
    switch (method) {
        case "CreditCard": return "Carte bancaire";
        case "Cash":       return "Espèces";
        case "CCE":        return "CCE";
        default:           return method;
    }
};

const getPaymentMethods = (payments: TransactionPaymentDTO[]) =>
    [...new Set(payments.map(p => formatPaymentMethod(p.paymentMethod)))].join(", ") || "—";

const getTotalAmount = (lines: TransactionLineDTO[]) =>
    lines.reduce((acc, l) => acc + (l.totalAmount ?? 0), 0);

// ── Modal de détail ───────────────────────────────────────────────────────────

interface TransactionHistoryModalProps {
    transaction: TransactionDTO;
    onClose: () => void;
}

const TransactionHistoryModal: FC<TransactionHistoryModalProps> = ({ transaction, onClose }) => {
    const total = getTotalAmount(transaction.lines);

    return (
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title">
                    Transaction TR-{String(transaction.idTransaction).padStart(6, "0")}
                </h2>
                <p className="modal-subtitle">
                    {formatDate(transaction.transactionDate)} · {transaction.type}
                </p>
            </div>

            {/* Articles */}
            <div className="modal-section">
                <div className="modal-section-head">
                    <h3 className="modal-section-title">Articles</h3>
                </div>
                {transaction.lines.length === 0 ? (
                    <p className="modal-empty">Aucun article.</p>
                ) : (
                    <table className="widget-table">
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Qté</th>
                                <th>Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.lines.map(line => (
                                <tr key={line.idTransactionLine}>
                                    <td>{line.item ? ("name" in line.item ? line.item.name : "—") : "—"}</td>
                                    <td>{line.quantity}</td>
                                    <td>{(line.totalAmount ?? 0).toFixed(2)} €</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={2} style={{ fontWeight: 600 }}>Total</td>
                                <td style={{ fontWeight: 600 }}>{total.toFixed(2)} €</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paiements */}
            <div className="modal-section">
                <div className="modal-section-head">
                    <h3 className="modal-section-title">Paiements</h3>
                </div>
                {transaction.payments.length === 0 ? (
                    <p className="modal-empty">Aucun paiement enregistré.</p>
                ) : (
                    <table className="widget-table">
                        <thead>
                            <tr>
                                <th>Mode</th>
                                <th>Montant</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.payments.map(payment => (
                                <tr key={payment.idTransactionPayment}>
                                    <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                                    <td>{payment.amount.toFixed(2)} €</td>
                                    <td>
                                        <span className={`status-badge ${payment.status === "accepted" ? "status-valide" : "status-annule"}`}>
                                            {payment.status === "accepted" ? "Accepté" : "Annulé"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
};

// ── Widget ────────────────────────────────────────────────────────────────────

export const TransactionHistoryWidget: FC = () => {
    const { openModal, closeModal } = useModal();

    const { data: transactions, loading, error } = useFetch<TransactionDTO[]>(
        apiUrl("/transactions/my"),
        10000
    );

    const handleRowClick = (transaction: TransactionDTO) => {
        openModal(
            <TransactionHistoryModal
                transaction={transaction}
                onClose={closeModal}
            />
        );
    };

    return (
        <div className="widget-container">
            <FetchWrapper loading={loading} error={error}>
                <div className="widget-table-wrap">
                    <table className="widget-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Date &amp; Heure</th>
                                <th>Montant Total</th>
                                <th>Mode de paiement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(transactions ?? []).map(t => (
                                <tr
                                    key={t.idTransaction}
                                    onClick={() => handleRowClick(t)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ fontFamily: "monospace", fontSize: "11px" }}>
                                        TR-{String(t.idTransaction).padStart(6, "0")}
                                    </td>
                                    <td>{formatDate(t.transactionDate)}</td>
                                    <td>{getTotalAmount(t.lines).toFixed(2)} €</td>
                                    <td>{getPaymentMethods(t.payments)}</td>
                                </tr>
                            ))}
                            {(transactions ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                                        Aucune transaction trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </FetchWrapper>
        </div>
    );
};
