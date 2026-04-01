import { useState, type FC } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import { FetchWrapper } from "../FetchWrapper.tsx";
import { type TransactionDTO, type TransactionLineDTO } from "../../types.ts";
import { apiUrl } from "../../api/common.ts";

// Mapping des statuts du backend vers les labels et classes CSS du front
const getStatusBadge = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "validated":
      return { class: "status-valide", label: "Validée" };
    case "canceled":
      return { class: "status-annule", label: "Annulée" };
    case "inprogress":
      return { class: "status-attente", label: "En cours" };
    default:
      return { class: "status-rembourse", label: status || "—" };
  }
};

// Fonction pour formater la date renvoyée par le backend
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

// Fonction pour calculer le total à partir des lignes
const calculateTotalAmount = (lines: TransactionLineDTO[]) => {
  if (!lines || lines.length === 0) return 0;
  return lines.reduce((acc, line) => acc + (line.totalAmount || 0), 0);
};

export const TransactionsWidget: FC = () => {
  const [search, setSearch] = useState("");

  const { data: transactions, loading, error } = useFetch<TransactionDTO[]>(
    apiUrl("/transactions"),
    5000
  );

  const filtered = (transactions || []).filter((t) =>
    String(t.idTransaction).includes(search) ||
    (t.type && t.type.toLowerCase().includes(search.toLowerCase())) ||
    (t.status && t.status.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRowClick = (transactionId: number) => {
    console.log("Transaction cliquée :", transactionId);
    // TODO: Afficher les détails des produits et paiements
  };

  return (
    <div className="widget-container">
      <div className="widget-toolbar">
        <div className="widget-search">
          <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher une transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <FetchWrapper loading={loading} error={error}>
        <div className="widget-table-wrap">
          <table className="widget-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Date &amp; heure</th>
                <th>Type</th>
                <th>Montant total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const statusInfo = getStatusBadge(t.status);
                return (
                  <tr
                    key={t.idTransaction}
                    onClick={() => handleRowClick(t.idTransaction)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ fontFamily: "monospace", fontSize: "11px" }}>
                      TR-{String(t.idTransaction).padStart(6, "0")}
                    </td>
                    <td>{formatDate(t.transactionDate)}</td>
                    <td>{t.type}</td>
                    <td>{calculateTotalAmount(t.lines).toFixed(2)} €</td>
                    <td>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
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
