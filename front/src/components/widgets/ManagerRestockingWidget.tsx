import { useEffect, useState, type FC } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import { FetchWrapper } from "../FetchWrapper.tsx";
import { useToast } from "../../contexts/ToastContext.tsx";
import { apiUrl, fetchJsonWithAuth } from "../../api/common.ts";
import {
    createRestock,
    deleteRestock,
    type RestockDTO,
    type StockItemDTO,
} from "../../api/merchandiseApi.ts";
import type { ApiError } from "../../types.ts";

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<RestockDTO["status"], string> = {
    pending:   "en cours",
    delivered: "effectué",
    canceled:  "annulé",
};

const STATUS_CSS: Record<RestockDTO["status"], string> = {
    pending:   "en-cours",
    delivered: "effectue",
    canceled:  "annule",
};

// ─── Types internes ───────────────────────────────────────────────────────────

interface RestockFormState {
    itemId:   string;
    quantity: string;
    date:     string;
}

function todayIso(): string {
    return new Date().toISOString().split("T")[0];
}

const EMPTY_FORM: RestockFormState = { itemId: "", quantity: "", date: todayIso() };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateForm(form: RestockFormState): string | null {
    if (!form.itemId)                                     return "Veuillez sélectionner un article.";
    if (!form.quantity || isNaN(parseFloat(form.quantity))) return "La quantité doit être un nombre valide.";
    if (parseFloat(form.quantity) <= 0)                   return "La quantité doit être supérieure à 0.";
    return null;
}

function toApiError(err: unknown): string {
    return (err as ApiError)?.message ?? "Une erreur inattendue s'est produite.";
}

// ─── Composant ────────────────────────────────────────────────────────────────

export const ManagerRestockingWidget: FC = () => {
    const { data: restocks, loading, error, refetch } = useFetch<RestockDTO[]>(apiUrl("/merchandise/restocks"));
    const { success, error: toastError } = useToast();

    const [stockItems, setStockItems] = useState<StockItemDTO[]>([]);
    const [search,   setSearch]   = useState("");
    const [showAdd,  setShowAdd]  = useState(false);
    const [addForm,  setAddForm]  = useState<RestockFormState>(EMPTY_FORM);

    // Chargement de la liste des articles pour le select
    useEffect(() => {
        fetchJsonWithAuth(apiUrl("/merchandise/stock"))
            .then((data: StockItemDTO[]) => setStockItems(data))
            .catch(() => {});
    }, []);

    // ── Filtrage ──────────────────────────────────────────────────────────────

    const filtered = (restocks ?? []).filter(r =>
        r.itemName.toLowerCase().includes(search.toLowerCase())
    );

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreate = async () => {
        const validationError = validateForm(addForm);
        if (validationError) { toastError(validationError); return; }

        try {
            await createRestock({
                itemId:      parseInt(addForm.itemId),
                quantity:    parseFloat(addForm.quantity),
                restockDate: addForm.date,
                status:      "pending",
            });
            const itemName = stockItems.find(s => String(s.id) === addForm.itemId)?.name ?? "Article";
            success(`Réapprovisionnement de "${itemName}" créé.`);
            setShowAdd(false);
            setAddForm(EMPTY_FORM);
            refetch();
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    const handleDelete = async (restock: RestockDTO) => {
        if (!confirm(`Supprimer le réapprovisionnement de "${restock.itemName}" ?`)) return;
        try {
            await deleteRestock(restock.idRestock);
            success(`Réapprovisionnement supprimé.`);
            refetch();
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    // ── Rendu ─────────────────────────────────────────────────────────────────

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container">

                {/* Toolbar */}
                <div className="widget-toolbar">
                    <div className="widget-search">
                        <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher un réapprovisionnement"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="widget-btn-add" type="button" title="Ajouter" onClick={() => setShowAdd(true)}>+</button>
                </div>

                {/* Tableau */}
                <div className="widget-table-wrap">
                    <table className="widget-table">
                        <thead>
                            <tr>
                                <th>Produit / Carburant</th>
                                <th>Quantité</th>
                                <th>Statut</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r.idRestock}>
                                    <td>{r.itemName}</td>
                                    <td>{r.quantity}{r.itemType === "carburant" ? " L" : ""}</td>
                                    <td>
                                        <span className={`status-badge status-${STATUS_CSS[r.status]}`}>
                                            {STATUS_LABELS[r.status]}
                                        </span>
                                    </td>
                                    <td>{r.restockDate}</td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="icon-btn delete" type="button" title="Supprimer" onClick={() => handleDelete(r)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modale — Ajouter */}
                {showAdd && (
                    <RestockModal
                        form={addForm}
                        stockItems={stockItems}
                        onChange={setAddForm}
                        onConfirm={handleCreate}
                        onCancel={() => { setShowAdd(false); setAddForm(EMPTY_FORM); }}
                    />
                )}

            </div>
        </FetchWrapper>
    );
};

// ─── Sous-composant modale ─────────────────────────────────────────────────────

interface RestockModalProps {
    form:       RestockFormState;
    stockItems: StockItemDTO[];
    onChange:   (form: RestockFormState) => void;
    onConfirm:  () => void;
    onCancel:   () => void;
}

const RestockModal: FC<RestockModalProps> = ({ form, stockItems, onChange, onConfirm, onCancel }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>Nouveau réapprovisionnement</h2>
            <select value={form.itemId} onChange={e => onChange({ ...form, itemId: e.target.value })}>
                <option value="">-- Choisir un article * --</option>
                {stockItems.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                ))}
            </select>
            <input
                placeholder="Quantité *"
                type="number" step="0.001" min="0"
                value={form.quantity}
                onChange={e => onChange({ ...form, quantity: e.target.value })}
            />
            <input
                type="date"
                value={form.date}
                onChange={e => onChange({ ...form, date: e.target.value })}
            />
            <div className="modal-actions">
                <button type="button" onClick={onCancel}>Annuler</button>
                <button type="button" onClick={onConfirm}>Confirmer</button>
            </div>
        </div>
    </div>
);
