import {type FC, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {useToast} from "../../contexts/ToastContext.tsx";
import {useModal} from "../../contexts/ModalContext.tsx";
import {apiUrl} from "../../api/common.ts";
import {
    createElectricity,
    createFuel,
    createProduct,
    deleteFuel,
    deleteElectricity,
    deleteProduct,
    type ElectricityDTO,
    type ItemDTO,
    updateElectricity,
    updateFuel,
    updateProduct,
} from "../../api/itemsApi.ts";
import {ConfirmModal} from "../modal/ConfirmModal.tsx";
import type {ApiError, ItemType} from "../../types.ts";

// ─── Types internes ───────────────────────────────────────────────────────────

interface ProductFormState {
    name: string;
    unitPrice: string;
    stock: string;
}

interface ElectricityFormState {
    name: string;
    normalPrice: string;
    fastPrice: string;
}

const EMPTY_FORM: ProductFormState = { name: "", unitPrice: "", stock: "" };

type ElectricityItem = ElectricityDTO & { itemType: "electricity" };
type ManagerItem = ItemDTO | ElectricityItem;
type ItemFilter = "all" | "product" | "fuel" | "electricity";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateForm(form: ProductFormState): string | null {
    if (!form.name.trim()) return "Le nom est obligatoire.";
    if (!form.unitPrice || isNaN(parseFloat(form.unitPrice))) return "Le prix doit être un nombre valide.";
    if (!form.stock || isNaN(parseFloat(form.stock))) return "Le stock doit être un nombre valide.";
    return null;
}

function validateElectricityForm(form: ElectricityFormState): string | null {
    if (!form.name.trim()) return "Le nom est obligatoire.";
    if (!form.normalPrice || isNaN(parseFloat(form.normalPrice))) return "Le prix normal doit être un nombre valide.";
    if (!form.fastPrice || isNaN(parseFloat(form.fastPrice))) return "Le prix rapide doit être un nombre valide.";
    return null;
}

function toApiError(err: unknown): string {
    return (err as ApiError)?.message ?? "Une erreur inattendue s'est produite.";
}

function isElectricityItem(item: ManagerItem): item is ElectricityItem {
    return item.itemType === "electricity";
}

function typeLabel(type: ManagerItem["itemType"]): string {
    switch (type) {
        case "product":
            return "Produit";
        case "fuel":
            return "Carburant";
        case "electricity":
            return "Électricité";
        default:
            return type;
    }
}

// ─── Composant ────────────────────────────────────────────────────────────────

export const ManagerProductsWidget: FC = () => {
    const { data: items, loading: itemsLoading, error: itemsError, refetch: refetchItems } =
        useFetch<ItemDTO[]>(apiUrl("/items/stock"));
    const { data: electricity, loading: electricityLoading, error: electricityError, refetch: refetchElectricity } =
        useFetch<ElectricityDTO[]>(apiUrl("/items/electricity"));
    const { success, error: toastError } = useToast();
    const { openModal } = useModal();

    const [search, setSearch]  = useState("");
    const [filter, setFilter]  = useState<ItemFilter>("all");

    // ── Filtrage ──────────────────────────────────────────────────────────────

    const managerItems: ManagerItem[] = [
        ...(items ?? []),
        ...(electricity ?? []).map(e => ({ ...e, itemType: "electricity" as const })),
    ];

    const filtered = managerItems.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "all" || m.itemType === filter)
    );

    // ── Handlers CRUD ─────────────────────────────────────────────────────────

    const handleUpdate = async (item: ItemDTO, form: ProductFormState): Promise<boolean> => {
        const validationError = validateForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            if (item.itemType === "product") {
                await updateProduct(item.id, {
                    name: form.name,
                    unitPrice: parseFloat(form.unitPrice),
                    stock: parseInt(form.stock),
                });
            } else {
                await updateFuel(item.id, {
                    name: form.name,
                    price: parseFloat(form.unitPrice),
                    stock: parseFloat(form.stock),
                });
            }
            success(`"${form.name}" mis à jour.`);
            refetchItems();
            refetchElectricity();
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleUpdateElectricity = async (item: ElectricityItem, form: ElectricityFormState): Promise<boolean> => {
        const validationError = validateElectricityForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            await updateElectricity(item.id, {
                name: form.name,
                normalPrice: parseFloat(form.normalPrice),
                fastPrice: parseFloat(form.fastPrice),
            });
            success(`"${form.name}" mis à jour.`);
            refetchItems();
            refetchElectricity();
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const executeDelete = async (item: ManagerItem) => {
        try {
            if (item.itemType === "electricity") {
                await deleteElectricity(item.id);
            } else if (item.itemType === "fuel") {
                await deleteFuel(item.id);
            } else {
                await deleteProduct(item.id);
            }
            success(`"${item.name}" supprimé.`);
            refetchItems();
            refetchElectricity();
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    const handleDelete = (item: ManagerItem) => {
        openModal(
            <ConfirmModal
                title="Supprimer la marchandise"
                message={`Supprimer "${item.name}" ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                onConfirm={() => { void executeDelete(item); }}
                danger
            />
        );
    };

    const handleCreateProduct = async (form: ProductFormState): Promise<boolean> => {
        const validationError = validateForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            await createProduct({
                name: form.name,
                unitPrice: parseFloat(form.unitPrice),
                stock: parseInt(form.stock),
            });
            success(`"${form.name}" créé.`);
            refetchItems();
            refetchElectricity();
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleCreateFuel = async (form: ProductFormState): Promise<boolean> => {
        const validationError = validateForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            await createFuel({
                name: form.name,
                price: parseFloat(form.unitPrice),
                stock: parseFloat(form.stock),
            });
            success(`"${form.name}" créé.`);
            refetchItems();
            refetchElectricity();
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleCreateElectricity = async (form: ElectricityFormState): Promise<boolean> => {
        const validationError = validateElectricityForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            await createElectricity({
                name: form.name,
                normalPrice: parseFloat(form.normalPrice),
                fastPrice: parseFloat(form.fastPrice),
            });
            success(`"${form.name}" créé.`);
            refetchItems();
            refetchElectricity();
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const openAddModal = () => {
        openModal(
            <AddItemModal
                onCreateProduct={handleCreateProduct}
                onCreateFuel={handleCreateFuel}
                onCreateElectricity={handleCreateElectricity}
            />
        );
    };

    const openEditModal = (item: ItemDTO) => {
        openModal(
            <ProductModal
                title={`Modifier "${item.name}"`}
                initialForm={{
                    name: item.name,
                    unitPrice: String(item.price),
                    stock: String(item.stock),
                }}
                onConfirm={(form) => handleUpdate(item, form)}
                priceLabel={item.itemType === "fuel" ? "Prix/L (€)" : "Prix unitaire (€)"}
                stockLabel={item.itemType === "fuel" ? "Stock (L)" : "Stock"}
            />
        );
    };

    const openEditElectricityModal = (item: ElectricityItem) => {
        openModal(
            <ElectricityModal
                title={`Modifier "${item.name}"`}
                initialForm={{
                    name: item.name,
                    normalPrice: String(item.normalPrice),
                    fastPrice: String(item.fastPrice),
                }}
                onConfirm={(form) => handleUpdateElectricity(item, form)}
            />
        );
    };

    // ── Rendu ─────────────────────────────────────────────────────────────────

    return (
        <FetchWrapper loading={itemsLoading || electricityLoading} error={itemsError ?? electricityError}>
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
                    <select
                        className="widget-select"
                        value={filter} 
                        onChange={e => setFilter(e.target.value as ItemFilter)}
                    >
                        <option value="all">Tous</option>
                        <option value="fuel">Carburant</option>
                        <option value="product">Produit</option>
                        <option value="electricity">Électricité</option>
                    </select>
                    <button className="widget-btn-add" type="button" title="Ajouter" onClick={openAddModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                        </svg>
                    </button>
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
                                    <td>
                                        {isElectricityItem(m) ? "—" : `${m.stock}${m.itemType === "fuel" ? " L" : ""}`}
                                    </td>
                                    <td>{typeLabel(m.itemType)}</td>
                                    <td>
                                        {isElectricityItem(m)
                                            ? <>
												<div>{m.normalPrice} €/kWh (normal)</div>
												<div>{m.fastPrice} €/kWh (rapide)</div>
											</>
                                            : <div>{m.price} {m.itemType === "fuel" ? "€/L" : "€"}</div>}
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            {isElectricityItem(m) ? (
                                                <button className="icon-btn" type="button" title="Modifier" onClick={() => openEditElectricityModal(m)}>✏️</button>
                                            ) : (
                                                <button className="icon-btn" type="button" title="Modifier" onClick={() => openEditModal(m)}>✏️</button>
                                            )}
                                            <button className="icon-btn delete" type="button" title="Supprimer" onClick={() => handleDelete(m)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </FetchWrapper>
    );
};

// ─── Sous-composant modale ─────────────────────────────────────────────────────

interface ProductModalProps {
    title: string;
    initialForm: ProductFormState;
    onConfirm: (form: ProductFormState) => Promise<boolean> | boolean;
    priceLabel: string;
    stockLabel: string;
}

interface AddItemModalProps {
    onCreateProduct: (form: ProductFormState) => Promise<boolean> | boolean;
    onCreateFuel: (form: ProductFormState) => Promise<boolean> | boolean;
    onCreateElectricity: (form: ElectricityFormState) => Promise<boolean> | boolean;
}

const AddItemModal: FC<AddItemModalProps> = ({ onCreateProduct, onCreateFuel, onCreateElectricity }) => {
    const { closeModal } = useModal();
    const [itemType, setItemType] = useState<ItemType>("product");
    const [productForm, setProductForm] = useState<ProductFormState>(EMPTY_FORM);
    const [electricityForm, setElectricityForm] = useState<ElectricityFormState>({
        name: "",
        normalPrice: "",
        fastPrice: "",
    });

    const syncName = (nextType: ItemType) => {
        if (nextType === "electricity") {
            setElectricityForm(prev => ({
                ...prev,
                name: prev.name || productForm.name,
            }));
        } else {
            setProductForm(prev => ({
                ...prev,
                name: prev.name || electricityForm.name,
            }));
        }
    };

    const handleTypeChange = (nextType: ItemType) => {
        syncName(nextType);
        setItemType(nextType);
    };

    const handleConfirm = async () => {
        let shouldClose = false;
        if (itemType === "electricity") {
            shouldClose = await onCreateElectricity(electricityForm);
        } else if (itemType === "fuel") {
            shouldClose = await onCreateFuel(productForm);
        } else {
            shouldClose = await onCreateProduct(productForm);
        }
        if (shouldClose) closeModal();
    };

    const isFuel = itemType === "fuel";

    return (
        <div className="modal-content modal-item-create">
            <div className="modal-header">
                <h2>Ajouter une marchandise</h2>
                <p className="modal-subtitle">Choisis le type puis renseigne les informations.</p>
            </div>
            <div className="modal-form">
                <label className="modal-field">
                    <span>Type de marchandise</span>
                    <select value={itemType} onChange={e => handleTypeChange(e.target.value as ItemType)}>
                        <option value="product">Produit</option>
                        <option value="fuel">Carburant</option>
                        <option value="electricity">Électricité</option>
                    </select>
                </label>

                {itemType === "electricity" ? (
                    <>
                        <label className="modal-field">
                            <span>Nom</span>
                            <input
                                value={electricityForm.name}
                                onChange={e => setElectricityForm({ ...electricityForm, name: e.target.value })}
                            />
                        </label>
                        <div className="modal-grid">
                            <label className="modal-field">
                                <span>Prix normal (EUR/kWh)</span>
                                <input
                                    type="number" step="0.001" min="0"
                                    value={electricityForm.normalPrice}
                                    onChange={e => setElectricityForm({ ...electricityForm, normalPrice: e.target.value })}
                                />
                            </label>
                            <label className="modal-field">
                                <span>Prix rapide (EUR/kWh)</span>
                                <input
                                    type="number" step="0.001" min="0"
                                    value={electricityForm.fastPrice}
                                    onChange={e => setElectricityForm({ ...electricityForm, fastPrice: e.target.value })}
                                />
                            </label>
                        </div>
                    </>
                ) : (
                    <>
                        <label className="modal-field">
                            <span>Nom</span>
                            <input
                                placeholder="Ex: Snack, huile moteur"
                                value={productForm.name}
                                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                            />
                        </label>
                        <div className="modal-grid">
                            <label className="modal-field">
                                <span>{isFuel ? "Prix/L (€)" : "Prix unitaire (€)"}</span>
                                <input
                                    type="number" step="0.001" min="0"
                                    value={productForm.unitPrice}
                                    onChange={e => setProductForm({ ...productForm, unitPrice: e.target.value })}
                                />
                            </label>
                            <label className="modal-field">
                                <span>{isFuel ? "Stock (L)" : "Stock"}</span>
                                <input
                                    type="number" step="0.001" min="0"
                                    value={productForm.stock}
                                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                                />
                            </label>
                        </div>
                    </>
                )}
            </div>
            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" type="button" onClick={closeModal}>Annuler</button>
                <button className="modal-button modal-button--confirm" type="button" onClick={handleConfirm}>
                    Créer
                </button>
            </div>
        </div>
    );
};

const ProductModal: FC<ProductModalProps> = ({ title, initialForm, onConfirm, priceLabel, stockLabel }) => {
    const { closeModal } = useModal();
    const [form, setForm] = useState<ProductFormState>(initialForm);

    return (
        <div className="modal-content modal-product-editor">
            <div className="modal-header">
                <h2>{title}</h2>
                <p className="modal-subtitle">Renseigne les informations du produit.</p>
            </div>
            <div className="modal-form">
                <label className="modal-field">
                    <span>Nom</span>
                    <input
                        placeholder="Ex: Snack, huile moteur"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </label>
                <label className="modal-field">
                    <span>{priceLabel}</span>
                    <input
                        type="number" step="0.001" min="0"
                        value={form.unitPrice}
                        onChange={e => setForm({ ...form, unitPrice: e.target.value })}
                    />
                </label>
                <label className="modal-field">
                    <span>{stockLabel}</span>
                    <input
                        type="number" step="0.001" min="0"
                        value={form.stock}
                        onChange={e => setForm({ ...form, stock: e.target.value })}
                    />
                </label>
            </div>
            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" type="button" onClick={closeModal}>Annuler</button>
                <button
                    className="modal-button modal-button--confirm"
                    type="button"
                    onClick={async () => {
                        const shouldClose = await onConfirm(form);
                        if (shouldClose) closeModal();
                    }}
                >
                    Confirmer
                </button>
            </div>
        </div>
    );
};

interface ElectricityModalProps {
    title: string;
    initialForm: ElectricityFormState;
    onConfirm: (form: ElectricityFormState) => Promise<boolean> | boolean;
}

const ElectricityModal: FC<ElectricityModalProps> = ({ title, initialForm, onConfirm }) => {
    const { closeModal } = useModal();
    const [form, setForm] = useState<ElectricityFormState>(initialForm);

    return (
        <div className="modal-content modal-electricity-editor">
            <div className="modal-header">
                <h2>{title}</h2>
                <p className="modal-subtitle">Définis les tarifs pour chargeurs normal et rapide.</p>
            </div>
            <div className="modal-form">
                <label className="modal-field">
                    <span>Nom</span>
                    <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </label>
                <label className="modal-field">
                    <span>Prix normal (EUR/kWh)</span>
                    <input
                        type="number" step="0.001" min="0"
                        value={form.normalPrice}
                        onChange={e => setForm({ ...form, normalPrice: e.target.value })}
                    />
                </label>
                <label className="modal-field">
                    <span>Prix rapide (EUR/kWh)</span>
                    <input
                        type="number" step="0.001" min="0"
                        value={form.fastPrice}
                        onChange={e => setForm({ ...form, fastPrice: e.target.value })}
                    />
                </label>
            </div>
            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" type="button" onClick={closeModal}>Annuler</button>
                <button
                    className="modal-button modal-button--confirm"
                    type="button"
                    onClick={async () => {
                        const shouldClose = await onConfirm(form);
                        if (shouldClose !== false) closeModal();
                    }}
                >
                    Confirmer
                </button>
            </div>
        </div>
    );
};
