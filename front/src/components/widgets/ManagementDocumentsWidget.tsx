import {type FC, useRef, useState} from "react";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {useToast} from "../../contexts/ToastContext.tsx";
import {useModal} from "../../contexts/ModalContext.tsx";
import {ConfirmModal} from "../modal/ConfirmModal.tsx";
import {apiUrl} from "../../api/common.ts";
import {
    createManagementDocument,
    deleteManagementDocument,
    importManagementDocument,
    type ManagementDocumentDTO,
    sendManagementDocument,
    updateManagementDocument,
} from "../../api/managementDocumentsApi.ts";
import type {ApiError} from "../../types.ts";
import "../../styles/widgets/management-documents.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toApiError(err: unknown): string {
    return (err as ApiError)?.message ?? "Une erreur inattendue s'est produite.";
}

function formatDateTime(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    const dd   = String(d.getDate()).padStart(2, "0");
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh   = String(d.getHours()).padStart(2, "0");
    const min  = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

// ─── Composant principal ──────────────────────────────────────────────────────

export const ManagementDocumentsWidget: FC = () => {
    const {data: documents, setData: setDocuments, loading, error} =
        useFetch<ManagementDocumentDTO[]>(apiUrl("/management-documents"), 5000);
    const {success, error: toastError} = useToast();
    const {openModal} = useModal();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedDoc  = documents?.find(d => d.id === selectedId) ?? null;
    const canEdit      = selectedDoc?.status === "pending";
    const canSend      = selectedDoc?.status === "pending";
    const canDelete    = selectedDoc?.status === "pending";
    const hasSelection = selectedDoc !== null;

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreate = async (name: string, content: string): Promise<boolean> => {
        if (!name.trim()) { toastError("Le nom est obligatoire."); return false; }
        try {
            const created = await createManagementDocument(name, content);
            success("Document créé.");
            setDocuments(prev => prev ? [...prev, created] : [created]);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleUpdate = async (name: string, content: string): Promise<boolean> => {
        if (!selectedDoc) return false;
        if (!name.trim()) { toastError("Le nom est obligatoire."); return false; }
        try {
            const updated = await updateManagementDocument(selectedDoc.id!, name, content);
            success("Document mis à jour.");
            setDocuments(prev => prev?.map(d => d.id === updated.id ? updated : d) ?? [updated]);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleImport = async (file: File) => {
        try {
            const imported = await importManagementDocument(file);
            success("PDF importé.");
            setDocuments(prev => prev ? [...prev, imported] : [imported]);
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    const executeSend = async (id: number) => {
        try {
            const updated = await sendManagementDocument(id);
            success("Document envoyé à la direction régionale.");
            setDocuments(prev => prev?.map(d => d.id === updated.id ? updated : d) ?? [updated]);
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    const executeDelete = async (id: number) => {
        try {
            await deleteManagementDocument(id);
            success("Document supprimé.");
            setDocuments(prev => prev?.filter(d => d.id !== id) ?? []);
            setSelectedId(null);
        } catch (err) {
            toastError(toApiError(err));
        }
    };

    // ── Ouverture des modales ──────────────────────────────────────────────────

    const openCreateModal = () => {
        openModal(
            <ManagementDocumentFormModal
                mode="create"
                title="Nouveau document"
                initialName=""
                initialContent=""
                onConfirm={handleCreate}
            />
        );
    };

    const openConsultModal = () => {
        if (!selectedDoc) return;
        openModal(
            <ManagementDocumentFormModal
                mode={canEdit ? "edit" : "view"}
                title="Consulter / Modifier"
                initialName={selectedDoc.name}
                initialContent={selectedDoc.content ?? ""}
                onConfirm={canEdit ? handleUpdate : undefined}
            />
        );
    };

    const openSendModal = () => {
        if (!selectedDoc) return;
        openModal(
            <ConfirmModal
                title="Envoi du document"
                message="Voulez-vous envoyer ce document à la direction régionale ? Il ne pourra plus être modifié."
                confirmLabel="Envoyer"
                onConfirm={() => { void executeSend(selectedDoc.id!); }}
            />
        );
    };

    const openDeleteModal = () => {
        if (!selectedDoc) return;
        openModal(
            <ConfirmModal
                title="Suppression du document"
                message={`Voulez-vous supprimer « ${selectedDoc.name} » ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                danger
                onConfirm={() => { void executeDelete(selectedDoc.id!); }}
            />
        );
    };

    const triggerImport = () => fileInputRef.current?.click();

    const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) void handleImport(file);
        e.target.value = "";
    };

    // ── Rendu ─────────────────────────────────────────────────────────────────

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container">

                <div className="widget-table-wrap">
                    <table className="widget-table mgmt-doc-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Dernière modification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(documents ?? []).map(doc => (
                                <tr
                                    key={doc.id}
                                    className={selectedId === doc.id ? "mgmt-doc-row-selected" : ""}
                                    onClick={() => setSelectedId(
                                        selectedId === doc.id ? null : doc.id!
                                    )}
                                >
                                    <td>{doc.name}</td>
                                    <td>{formatDateTime(doc.lastModified)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mgmt-doc-actions-bar">
                    <button className="mgmt-doc-action-btn" type="button" onClick={openCreateModal}>
                        Créer
                    </button>
                    <button className="mgmt-doc-action-btn" type="button" onClick={triggerImport}>
                        Importer
                    </button>
                    <button
                        className="mgmt-doc-action-btn"
                        type="button"
                        onClick={openConsultModal}
                        disabled={!hasSelection}
                    >
                        Consulter/Modifier
                    </button>
                    <button
                        className="mgmt-doc-action-btn mgmt-doc-action-btn--primary"
                        type="button"
                        onClick={openSendModal}
                        disabled={!canSend}
                    >
                        Envoyer
                    </button>
                    <button
                        className="mgmt-doc-action-btn mgmt-doc-action-btn--danger"
                        type="button"
                        onClick={openDeleteModal}
                        disabled={!canDelete}
                    >
                        Supprimer
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    style={{display: "none"}}
                    onChange={onFileSelected}
                />

            </div>
        </FetchWrapper>
    );
};

// ─── Modale Créer / Consulter / Modifier ──────────────────────────────────────

interface ManagementDocumentFormModalProps {
    mode: "create" | "edit" | "view";
    title: string;
    initialName: string;
    initialContent: string;
    onConfirm?: (name: string, content: string) => Promise<boolean>;
}

const ManagementDocumentFormModal: FC<ManagementDocumentFormModalProps> = ({
    mode, title, initialName, initialContent, onConfirm,
}) => {
    const {closeModal} = useModal();
    const [name, setName] = useState(initialName);
    const readOnly = mode === "view";

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editable: !readOnly,
    });

    const handleConfirm = async () => {
        if (readOnly || !onConfirm) { closeModal(); return; }
        const html = editor?.getHTML() ?? "";
        const shouldClose = await onConfirm(name, html);
        if (shouldClose) closeModal();
    };

    return (
        <div className="modal-content modal-mgmt-doc">
            <div className="modal-header">
                <h2>{title}</h2>
            </div>
            <div className="modal-form">
                <label className="modal-field">
                    <span>Nom</span>
                    <input
                        value={name}
                        disabled={readOnly}
                        placeholder="Nom du document"
                        onChange={e => setName(e.target.value)}
                    />
                </label>
                <div className="modal-field">
                    <span>Contenu</span>
                    <div className={`mgmt-doc-editor${readOnly ? " mgmt-doc-editor--readonly" : ""}`}>
                        {!readOnly && (
                            <div className="mgmt-doc-toolbar">
                                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
                                    className={editor?.isActive("bold") ? "active" : ""}>
                                    <strong>G</strong>
                                </button>
                                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    className={editor?.isActive("italic") ? "active" : ""}>
                                    <em>I</em>
                                </button>
                                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                    className={editor?.isActive("bulletList") ? "active" : ""}>
                                    ≡
                                </button>
                                <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                    className={editor?.isActive("orderedList") ? "active" : ""}>
                                    1.
                                </button>
                            </div>
                        )}
                        <EditorContent editor={editor} className="mgmt-doc-editor-content"/>
                    </div>
                </div>
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
