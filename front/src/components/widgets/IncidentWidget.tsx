import {type FC, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {useToast} from "../../contexts/ToastContext.tsx";
import {useModal} from "../../contexts/ModalContext.tsx";
import {ConfirmModal} from "../modal/ConfirmModal.tsx";
import {apiUrl} from "../../api/common.ts";
import {
    createIncident,
    type DocumentStatus,
    type IncidentReportDTO,
    sendIncident,
    updateIncident,
} from "../../api/incidentsApi.ts";
import type {ApiError} from "../../types.ts";
import "../../styles/widgets/incident.css";

// ─── Types internes ───────────────────────────────────────────────────────────

interface IncidentFormState {
    date: string;           // "YYYY-MM-DD"
    time: string;           // "HH:mm"
    type: string;
    technicalDetail: string;
    resolution: string;
}

type ModalMode = "create" | "edit" | "view";

const EMPTY_FORM: IncidentFormState = {
    date: "",
    time: "",
    type: "",
    technicalDetail: "",
    resolution: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toApiError(err: unknown): string {
    return (err as ApiError)?.message ?? "Une erreur inattendue s'est produite.";
}

function formatDateTime(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} / ${hh}:${min}`;
}

function nowDateString(): string {
    return new Date().toISOString().split("T")[0];
}

function nowTimeString(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function incidentToForm(incident: IncidentReportDTO): IncidentFormState {
    const iso = incident.date ?? "";
    return {
        date: iso.split("T")[0] || nowDateString(),
        time: iso.split("T")[1]?.substring(0, 5) || nowTimeString(),
        type: incident.type ?? "",
        technicalDetail: incident.technicalDetail ?? "",
        resolution: incident.resolution ?? "",
    };
}

function formToIso(form: IncidentFormState): string {
    return `${form.date}T${form.time}:00`;
}

function validateForm(form: IncidentFormState): string | null {
    if (!form.date) return "La date est obligatoire.";
    if (!form.time) return "L'heure est obligatoire.";
    if (!form.type.trim()) return "Le type est obligatoire.";
    if (!form.technicalDetail.trim()) return "Le détail technique est obligatoire.";
    if (!form.resolution.trim()) return "La solution apportée est obligatoire.";
    return null;
}

function statusLabel(status: DocumentStatus): string {
    switch (status) {
        case "pending":   return "en attente";
        case "sentToDR":  return "envoyée";
        case "locked":    return "verrouillée";
    }
}

function statusClass(status: DocumentStatus): string {
    switch (status) {
        case "pending":   return "status-pending";
        case "sentToDR":  return "status-rembourse";
        case "locked":    return "status-canceled";
    }
}

// ─── Composant principal ──────────────────────────────────────────────────────

export const IncidentWidget: FC = () => {
    const {data: incidents, setData: setIncidents, loading, error} =
        useFetch<IncidentReportDTO[]>(apiUrl("/incidents"), 5000);
    const {success, error: toastError} = useToast();
    const {openModal} = useModal();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedIncident = incidents?.find(i => i.id === selectedId) ?? null;
    const canModify = selectedIncident !== null && selectedIncident.status === "pending";
    const canSend   = selectedIncident !== null && selectedIncident.status === "pending";

    // ── Handlers CRUD ─────────────────────────────────────────────────────────

    const handleCreate = async (form: IncidentFormState): Promise<boolean> => {
        const validationError = validateForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            const created = await createIncident({
                type: form.type,
                date: formToIso(form),
                technicalDetail: form.technicalDetail,
                resolution: form.resolution,
            });
            success("Fiche incident créée.");
            setIncidents(prev => prev ? [...prev, created] : [created]);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleUpdate = async (form: IncidentFormState): Promise<boolean> => {
        if (!selectedIncident) return false;
        const validationError = validateForm(form);
        if (validationError) { toastError(validationError); return false; }

        try {
            const updated = await updateIncident(selectedIncident.id!, {
                ...selectedIncident,
                type: form.type,
                date: formToIso(form),
                technicalDetail: form.technicalDetail,
                resolution: form.resolution,
            });
            success("Fiche incident mise à jour.");
            setIncidents(prev => prev ? prev.map(i => i.id === updated.id ? updated : i) : [updated]);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const executeSend = async (id: number) => {
        try {
            const updated = await sendIncident(id);
            success("Fiche incident envoyée.");
            setIncidents(prev => prev ? prev.map(i => i.id === updated.id ? updated : i) : [updated]);
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    // ── Ouverture des modales ──────────────────────────────────────────────────

    const openCreateModal = () => {
        openModal(
            <IncidentFormModal
                mode="create"
                title="Nouvelle fiche incident"
                initialForm={{...EMPTY_FORM, date: nowDateString(), time: nowTimeString()}}
                onConfirm={handleCreate}
            />
        );
    };

    const openEditModal = () => {
        if (!selectedIncident) return;
        openModal(
            <IncidentFormModal
                mode="edit"
                title="Modification fiche incident"
                initialForm={incidentToForm(selectedIncident)}
                onConfirm={handleUpdate}
            />
        );
    };

    const openViewModal = () => {
        if (!selectedIncident) return;
        openModal(
            <IncidentFormModal
                mode="view"
                title="Consultation fiche incident"
                initialForm={incidentToForm(selectedIncident)}
            />
        );
    };

    const openSendModal = () => {
        if (!selectedIncident) return;
        openModal(
            <ConfirmModal
                title="Envoi de la fiche incident"
                message="Voulez-vous vraiment envoyer cette fiche incident ?"
                confirmLabel="Envoyer"
                onConfirm={() => { void executeSend(selectedIncident.id!); }}
            />
        );
    };

    // ── Rendu ─────────────────────────────────────────────────────────────────

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container">

                <div className="widget-table-wrap">
                    <table className="widget-table incident-table">
                        <thead>
                            <tr>
                                <th>Date / Heure</th>
                                <th>Type</th>
                                <th>Détail technique</th>
                                <th>Solution apportée</th>
                                <th>Statut</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(incidents ?? []).map(incident => (
                                <tr
                                    key={incident.id}
                                    className={selectedId === incident.id ? "incident-row-selected" : ""}
                                    onClick={() => setSelectedId(
                                        selectedId === incident.id ? null : incident.id!
                                    )}
                                >
                                    <td>{formatDateTime(incident.date)}</td>
                                    <td>{incident.type}</td>
                                    <td className="cell-truncate">{incident.technicalDetail}</td>
                                    <td className="cell-truncate">{incident.resolution}</td>
                                    <td>
                                        <span className={`status-badge ${statusClass(incident.status)}`}>
                                            {statusLabel(incident.status)}
                                        </span>
                                    </td>
                                    <td>{String(incident.id).padStart(2, "0")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="incident-actions-bar">
                    <button className="incident-action-btn" type="button" onClick={openCreateModal}>
                        Créer
                    </button>
                    <button
                        className="incident-action-btn"
                        type="button"
                        onClick={openEditModal}
                        disabled={!canModify}
                    >
                        Modifier
                    </button>
                    <button
                        className="incident-action-btn"
                        type="button"
                        onClick={openViewModal}
                        disabled={selectedIncident === null}
                    >
                        Consulter
                    </button>
                    <button
                        className="incident-action-btn incident-action-btn--primary"
                        type="button"
                        onClick={openSendModal}
                        disabled={!canSend}
                    >
                        Envoyer
                    </button>
                </div>

            </div>
        </FetchWrapper>
    );
};

// ─── Sous-composant modale ────────────────────────────────────────────────────

interface IncidentFormModalProps {
    mode: ModalMode;
    title: string;
    initialForm: IncidentFormState;
    onConfirm?: (form: IncidentFormState) => Promise<boolean> | boolean;
}

const IncidentFormModal: FC<IncidentFormModalProps> = ({mode, title, initialForm, onConfirm}) => {
    const {closeModal} = useModal();
    const [form, setForm] = useState<IncidentFormState>(initialForm);
    const readOnly = mode === "view";

    const handleConfirm = async () => {
        if (readOnly || !onConfirm) {
            closeModal();
            return;
        }
        const shouldClose = await onConfirm(form);
        if (shouldClose) closeModal();
    };

    return (
        <div className="modal-content modal-incident">
            <div className="modal-header">
                <h2>{title}</h2>
            </div>
            <div className="modal-form">
                <div className="modal-grid">
                    <label className="modal-field">
                        <span>Date</span>
                        <input
                            type="date"
                            value={form.date}
                            disabled={readOnly}
                            onChange={e => setForm({...form, date: e.target.value})}
                        />
                    </label>
                    <label className="modal-field">
                        <span>Heure</span>
                        <input
                            type="time"
                            value={form.time}
                            disabled={readOnly}
                            onChange={e => setForm({...form, time: e.target.value})}
                        />
                    </label>
                </div>
                <label className="modal-field">
                    <span>Type</span>
                    <input
                        placeholder="Ex: Matériel, Humain"
                        value={form.type}
                        disabled={readOnly}
                        onChange={e => setForm({...form, type: e.target.value})}
                    />
                </label>
                <label className="modal-field">
                    <span>Détail technique</span>
                    <input
                        placeholder="Ex: Pompe n°2 HS"
                        value={form.technicalDetail}
                        disabled={readOnly}
                        onChange={e => setForm({...form, technicalDetail: e.target.value})}
                    />
                </label>
                <label className="modal-field">
                    <span>Solution apportée</span>
                    <input
                        placeholder="Ex: Réparation instantannée"
                        value={form.resolution}
                        disabled={readOnly}
                        onChange={e => setForm({...form, resolution: e.target.value})}
                    />
                </label>
            </div>
            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" type="button" onClick={closeModal}>
                    Annuler
                </button>
                <button className="modal-button modal-button--confirm" type="button" onClick={handleConfirm}>
                    Valider
                </button>
            </div>
        </div>
    );
};
