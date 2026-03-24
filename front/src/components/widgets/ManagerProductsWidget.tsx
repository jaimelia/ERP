import { useState, type FC } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import { FetchWrapper } from "../FetchWrapper.tsx";
import { useToast } from "../../contexts/ToastContext.tsx";
import { apiUrl } from "../../api/common.ts";
import {
    createProduct,
    deleteProduct,
    updateFuel,
    updateProduct,
    type StockItemDTO,
} from "../../api/merchandiseApi.ts";
import type { ApiError } from "../../types.ts";

// ─── Types internes ───────────────────────────────────────────────────────────

interface ProductFormState {
    name: string;
    price: string;
    stock: string;
    threshold: string;
}

const EMPTY_FORM: ProductFormState = { name: "", price: "", stock: "", threshold: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateForm(form: ProductFormState): string | null {
    if (!form.name.trim())          return "Le nom est obligatoire.";
    if (!form.price || isNaN(parseFloat(form.price))) return "Le prix doit être un nombre valide.";
    if (!form.stock || isNaN(parseFloat(form.stock))) return "Le stock doit être un nombre valide.";
    return null;
}

function toApiError(err: unknown): string {
    return (err as ApiError)?.message ?? "Une erreur inattendue s'est produite.";
}

// ─── Composant ────────────────────────────────────────────────────────────────

export const ManagerProductsWidget: FC = () => {
    const { data: items, loading, error, refetch } = useFetch<StockItemDTO[]>(apiUrl("/merchandise/stock"));
    const { success, error: toastError } = useToast();

    const [search,  setSearch]  = useState("");
    const [filtre,  setFiltre]  = useState("Tous");
    const [editing, setEditing] = useState<StockItemDTO | null>(null);
    const [editForm, setEditForm] = useState<ProductFormState>(EMPTY_FORM);
    const [showAdd,  setShowAdd]  = useState(false);
    const [addForm,  setAddForm]  = useState<ProductFormState>(EMPTY_FORM);

    // ── Filtrage ──────────────────────────────────────────────────────────────

    const filtered = (items ?? []).filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) &&
        (filtre === "Tous" || m.type === filtre)
    );

    // ── Handlers CRUD ─────────────────────────────────────────────────────────

    const openEdit = (item: StockItemDTO) => {
        setEditing(item);
        setEditForm({
            name:      item.name,
            price:     String(item.price),
            stock:     String(item.stock),
            threshold: item.alertThreshold != null ? String(item.alertThreshold) : "0",
        });
    };

    const handleUpdate = async () => {
        if (!editing) return;
        const validationError = validateForm(editForm);
        if (validationError) { toastError(validationError); return; }

        try {
            if (editing.type === "Produit") {
                await updateProduct(editing.id, {
                    name:           editForm.name,
                    unitPrice:      parseFloat(editForm.price),
                    stock:          parseInt(editForm.stock),
                    alertThreshold: parseInt(editForm.threshold) || 0,
                });
            } else {
                await updateFuel(editing.id, {
                    name:           editForm.name,
                    pricePerLiter:  parseFloat(editForm.price),
                    stock:          parseFloat(editForm.stock),
                    alertThreshold: parseFloat(editForm.threshold) || 0,
                });
            }
            success(`"${editForm.name}" mis à jour.`);
            setEditing(null);
            refetch();
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    const handleDelete = async (item: StockItemDTO) => {
        if (!confirm(`Supprimer "${item.name}" ?`)) return;
        try {
            await deleteProduct(item.id);
            success(`"${item.name}" supprimé.`);
            refetch();
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    const handleCreate = async () => {
        const validationError = validateForm(addForm);
        if (validationError) { toastError(validationError); return; }

        try {
            await createProduct({
                name:           addForm.name,
                unitPrice:      parseFloat(addForm.price),
                stock:          parseInt(addForm.stock),
                alertThreshold: parseInt(addForm.threshold) || 0,
            });
            success(`"${addForm.name}" créé.`);
            setShowAdd(false);
            setAddForm(EMPTY_FORM);
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
                            placeholder="Rechercher une marchandise"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="widget-select" value={filtre} onChange={e => setFiltre(e.target.value)}>
                        <option>Tous</option>
                        <option>Carburant</option>
                        <option>Produit</option>
                    </select>
                    <button className="widget-btn-add" type="button" title="Ajouter" onClick={() => setShowAdd(true)}>+</button>
                </div>

                {/* Tableau */}
                <div className="widget-table-wrap">
                    <table className="widget-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                                <th>Type</th>
                                <th>Prix</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(m => (
                                <tr key={m.id}>
                                    <td>{m.name}</td>
                                    <td>{m.stock}{m.type === "Carburant" ? " L" : ""}</td>
                                    <td>{m.type}</td>
                                    <td>{m.price} {m.type === "Carburant" ? "€/L" : "€"}</td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="icon-btn" type="button" title="Modifier" onClick={() => openEdit(m)}>✏️</button>
                                            {m.type === "Produit" && (
                                                <button className="icon-btn delete" type="button" title="Supprimer" onClick={() => handleDelete(m)}>🗑️</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modale — Ajouter */}
                {showAdd && (
                    <ProductModal
                        title="Ajouter un produit"
                        form={addForm}
                        onChange={setAddForm}
                        onConfirm={handleCreate}
                        onCancel={() => { setShowAdd(false); setAddForm(EMPTY_FORM); }}
                        priceLabel="Prix unitaire (€)"
                        stockLabel="Stock"
                    />
                )}

                {/* Modale — Modifier */}
                {editing && (
                    <ProductModal
                        title={`Modifier "${editing.name}"`}
                        form={editForm}
                        onChange={setEditForm}
                        onConfirm={handleUpdate}
                        onCancel={() => setEditing(null)}
                        priceLabel={editing.type === "Carburant" ? "Prix/L (€)" : "Prix unitaire (€)"}
                        stockLabel={editing.type === "Carburant" ? "Stock (L)" : "Stock"}
                    />
                )}

            </div>
        </FetchWrapper>
    );
};

// ─── Sous-composant modale ─────────────────────────────────────────────────────

interface ProductModalProps {
    title: string;
    form: ProductFormState;
    onChange: (form: ProductFormState) => void;
    onConfirm: () => void;
    onCancel: () => void;
    priceLabel: string;
    stockLabel: string;
}

const ProductModal: FC<ProductModalProps> = ({ title, form, onChange, onConfirm, onCancel, priceLabel, stockLabel }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>{title}</h2>
            <input
                placeholder="Nom *"
                value={form.name}
                onChange={e => onChange({ ...form, name: e.target.value })}
            />
            <input
                placeholder={`${priceLabel} *`}
                type="number" step="0.001" min="0"
                value={form.price}
                onChange={e => onChange({ ...form, price: e.target.value })}
            />
            <input
                placeholder={`${stockLabel} *`}
                type="number" step="0.001" min="0"
                value={form.stock}
                onChange={e => onChange({ ...form, stock: e.target.value })}
            />
            <input
                placeholder="Seuil d'alerte"
                type="number" min="0"
                value={form.threshold}
                onChange={e => onChange({ ...form, threshold: e.target.value })}
            />
            <div className="modal-actions">
                <button type="button" onClick={onCancel}>Annuler</button>
                <button type="button" onClick={onConfirm}>Confirmer</button>
            </div>
        </div>
    </div>
);
