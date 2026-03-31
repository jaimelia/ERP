import {type FC, useEffect, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {useToast} from "../../contexts/ToastContext.tsx";
import {useModal} from "../../contexts/ModalContext.tsx";
import {apiUrl} from "../../api/common.ts";
import {
    createDailyReport,
    type DailyReportRequestDTO,
    type DailyReportSummaryDTO,
    type DailyTransactionsReportDTO,
    getDailyReportById,
    previewDailyReport,
    updateDailyReport,
    validateDailyReport,
} from "../../api/dailyReportsApi.ts";
import type {ApiError} from "../../types.ts";
import "../../styles/widgets/daily-report.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toApiError(err: unknown): string {
    return (err as ApiError)?.message ?? "Une erreur inattendue s'est produite.";
}

function formatDate(iso: string): string {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
}

function formatAmount(value: number): string {
    return value.toLocaleString("fr-FR", {minimumFractionDigits: 0, maximumFractionDigits: 2}) + "€";
}

function toSummary(dto: DailyTransactionsReportDTO): DailyReportSummaryDTO {
    return {
        id: dto.id!,
        reportDate: dto.reportDate,
        transactionCount: dto.transactionCount,
        totalAmount: dto.totalAmount,
        status: dto.status!,
    };
}

function todayIso(): string {
    return new Date().toISOString().split("T")[0];
}

// ─── Widget principal ─────────────────────────────────────────────────────────

export const DailyTransactionsReportWidget: FC = () => {
    const {data: reports, setData: setReports, loading, error} =
        useFetch<DailyReportSummaryDTO[]>(apiUrl("/daily-reports"), 10_000);
    const {success, error: toastError} = useToast();
    const {openModal} = useModal();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedReport = reports?.find(r => r.id === selectedId) ?? null;
    const isPending      = selectedReport?.status === "pending";
    const hasSelection   = selectedReport !== null;

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreate = async (request: DailyReportRequestDTO): Promise<boolean> => {
        try {
            const created = await createDailyReport(request);
            success("Rapport créé.");
            setReports(prev => prev ? [toSummary(created), ...prev] : [toSummary(created)]);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleUpdate = async (request: DailyReportRequestDTO): Promise<boolean> => {
        if (!selectedId) return false;
        try {
            const updated = await updateDailyReport(selectedId, request);
            success("Rapport mis à jour.");
            setReports(prev => prev?.map(r => r.id === updated.id ? toSummary(updated) : r) ?? []);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    const handleValidate = async (): Promise<boolean> => {
        if (!selectedId) return false;
        try {
            const validated = await validateDailyReport(selectedId);
            success("Rapport verrouillé définitivement.");
            setReports(prev => prev?.map(r => r.id === validated.id ? toSummary(validated) : r) ?? []);
            setSelectedId(null);
            return true;
        } catch (err) {
            toastError(toApiError(err));
            return false;
        }
    };

    // ── Ouverture des modales ──────────────────────────────────────────────────

    const openCreateModal = () => {
        openModal(
            <DailyReportModal
                mode="create"
                reportId={null}
                onConfirm={handleCreate}
            />
        );
    };

    const openEditModal = () => {
        if (!selectedId) return;
        openModal(
            <DailyReportModal
                mode="edit"
                reportId={selectedId}
                onConfirm={handleUpdate}
            />
        );
    };

    const openViewModal = () => {
        if (!selectedId) return;
        openModal(
            <DailyReportModal
                mode="view"
                reportId={selectedId}
            />
        );
    };

    const openValidateModal = () => {
        if (!selectedId) return;
        openModal(
            <DailyReportModal
                mode="validate"
                reportId={selectedId}
                onConfirm={handleValidate}
            />
        );
    };

    // ── Rendu ─────────────────────────────────────────────────────────────────

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container">

                <div className="widget-table-wrap">
                    <table className="widget-table daily-report-list-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Nombre transactions</th>
                                <th>Montant total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(reports ?? []).map(report => (
                                <tr
                                    key={report.id}
                                    className={selectedId === report.id ? "daily-report-row-selected" : ""}
                                    onClick={() => setSelectedId(selectedId === report.id ? null : report.id)}
                                >
                                    <td>{formatDate(report.reportDate)}</td>
                                    <td>{report.transactionCount}</td>
                                    <td>{formatAmount(report.totalAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="daily-report-actions-bar">
                    <button
                        className="daily-report-action-btn"
                        type="button"
                        onClick={openCreateModal}
                    >
                        Créer table transaction journalière
                    </button>
                    <button
                        className="daily-report-action-btn"
                        type="button"
                        onClick={openEditModal}
                        disabled={!isPending}
                    >
                        Modifier table transaction journalière
                    </button>
                    <button
                        className="daily-report-action-btn"
                        type="button"
                        onClick={openViewModal}
                        disabled={!hasSelection}
                    >
                        Consulter table transaction journalière
                    </button>
                    <button
                        className="daily-report-action-btn daily-report-action-btn--primary"
                        type="button"
                        onClick={openValidateModal}
                        disabled={!isPending}
                    >
                        Valider table transaction journalière
                    </button>
                </div>

            </div>
        </FetchWrapper>
    );
};

// ─── Modale Détail ────────────────────────────────────────────────────────────

type ModalMode = "create" | "edit" | "view" | "validate";

const MODAL_TITLES: Record<ModalMode, string> = {
    create:   "Créer table-relevé des transactions journalières",
    edit:     "Modifier table-relevé des transactions journalières",
    view:     "Consulter table des transactions journalières",
    validate: "Valider table des transactions journalières",
};

interface FormState {
    totalFuelVolume: string;
    totalFuelsAmount: string;
    totalElectricityVolume: string;
    totalElectricityAmount: string;
    totalProductVolume: string;
    totalProductsAmount: string;
    automatTransactionCount: string;
    cashierTransactionCount: string;
}

function dtoToForm(dto: DailyTransactionsReportDTO): FormState {
    return {
        totalFuelVolume:          String(dto.totalFuelVolume),
        totalFuelsAmount:         String(dto.totalFuelsAmount),
        totalElectricityVolume:   String(dto.totalElectricityVolume),
        totalElectricityAmount:   String(dto.totalElectricityAmount),
        totalProductVolume:       String(dto.totalProductVolume),
        totalProductsAmount:      String(dto.totalProductsAmount),
        automatTransactionCount:  String(dto.automatTransactionCount),
        cashierTransactionCount:  String(dto.cashierTransactionCount),
    };
}

function formToRequest(form: FormState, reportDate: string): DailyReportRequestDTO {
    return {
        reportDate,
        totalFuelVolume:          parseFloat(form.totalFuelVolume)          || 0,
        totalFuelsAmount:         parseFloat(form.totalFuelsAmount)         || 0,
        totalElectricityVolume:   parseFloat(form.totalElectricityVolume)   || 0,
        totalElectricityAmount:   parseFloat(form.totalElectricityAmount)   || 0,
        totalProductVolume:       parseFloat(form.totalProductVolume)       || 0,
        totalProductsAmount:      parseFloat(form.totalProductsAmount)      || 0,
        automatTransactionCount:  parseInt(form.automatTransactionCount)    || 0,
        cashierTransactionCount:  parseInt(form.cashierTransactionCount)    || 0,
    };
}

interface DailyReportModalProps {
    mode: ModalMode;
    reportId: number | null;
    onConfirm?: (request: DailyReportRequestDTO) => Promise<boolean>;
}

// onConfirm pour validate n'a pas besoin du request
interface DailyReportValidateModalProps {
    mode: "validate";
    reportId: number;
    onConfirm?: () => Promise<boolean>;
}

type AnyDailyReportModalProps = DailyReportModalProps | DailyReportValidateModalProps;

const DailyReportModal: FC<AnyDailyReportModalProps> = (props) => {
    const {mode, reportId} = props;
    const {closeModal} = useModal();
    const [dto, setDto]             = useState<DailyTransactionsReportDTO | null>(null);
    const [form, setForm]           = useState<FormState | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const isReadOnly = mode === "view" || mode === "validate";

    useEffect(() => {
        const load = async () => {
            try {
                const loaded = mode === "create"
                    ? await previewDailyReport(todayIso())
                    : await getDailyReportById(reportId!);
                setDto(loaded);
                setForm(dtoToForm(loaded));
            } catch (err) {
                setLoadError(toApiError(err));
            }
        };
        void load();
    }, [mode, reportId]);

    const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => prev ? {...prev, [key]: e.target.value} : prev);
    };

    const handleConfirm = async () => {
        if (mode === "view") { closeModal(); return; }

        if (mode === "validate") {
            const {onConfirm} = props as DailyReportValidateModalProps;
            if (!onConfirm) { closeModal(); return; }
            const shouldClose = await onConfirm();
            if (shouldClose) closeModal();
            return;
        }

        if (!form || !dto) return;
        const {onConfirm} = props as DailyReportModalProps;
        if (!onConfirm) { closeModal(); return; }
        const request = formToRequest(form, dto.reportDate);
        const shouldClose = await onConfirm(request);
        if (shouldClose) closeModal();
    };

    const totalTransactions = form
        ? (parseInt(form.automatTransactionCount) || 0) + (parseInt(form.cashierTransactionCount) || 0)
        : 0;

    const totalAmount = form
        ? (parseFloat(form.totalFuelsAmount) || 0)
          + (parseFloat(form.totalElectricityAmount) || 0)
          + (parseFloat(form.totalProductsAmount) || 0)
        : 0;

    return (
        <div className="modal-content modal-daily-report">
            <div className="modal-header">
                <h2>{MODAL_TITLES[mode]}</h2>
            </div>

            {loadError && <p className="modal-error">{loadError}</p>}

            {!dto && !loadError && (
                <p className="daily-report-loading">Chargement...</p>
            )}

            {dto && form && (
                <>
                    {/* ── Table des carburants ── */}
                    {dto.fuelLines.length > 0 && (
                        <div className="daily-report-fuel-wrap">
                            <table className="widget-table daily-report-fuel-table">
                                <thead>
                                    <tr>
                                        <th>Carburant</th>
                                        <th>Volume délivré</th>
                                        <th>Prix au Litre</th>
                                        <th>Montant total délivré</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dto.fuelLines.map(line => (
                                        <tr key={line.fuelName}>
                                            <td>{line.fuelName}</td>
                                            <td>{line.volumeDelivered}L</td>
                                            <td>{line.pricePerLiter.toLocaleString("fr-FR", {minimumFractionDigits: 2, maximumFractionDigits: 3})}€ / L</td>
                                            <td>{formatAmount(line.totalAmount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Grille des totaux ── */}
                    <div className="daily-report-grid">
                        <div className="daily-report-grid-cell">
                            <label>Volume total carburant délivré :</label>
                            <input
                                className="daily-report-value-input"
                                type="number"
                                min="0"
                                value={form.totalFuelVolume}
                                onChange={setField("totalFuelVolume")}
                                disabled={isReadOnly}
                                readOnly={isReadOnly}
                            />
                            <span className="daily-report-unit">L</span>
                        </div>
                        <div className="daily-report-grid-cell">
                            <label>Montant total carburant :</label>
                            {isReadOnly
                                ? <span className="daily-report-amount">{formatAmount(parseFloat(form.totalFuelsAmount) || 0)}</span>
                                : <input
                                    className="daily-report-value-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.totalFuelsAmount}
                                    onChange={setField("totalFuelsAmount")}
                                  />
                            }
                        </div>

                        <div className="daily-report-grid-cell">
                            <label>Volume total électricité délivrée :</label>
                            <input
                                className="daily-report-value-input"
                                type="number"
                                min="0"
                                value={form.totalElectricityVolume}
                                onChange={setField("totalElectricityVolume")}
                                disabled={isReadOnly}
                                readOnly={isReadOnly}
                            />
                            <span className="daily-report-unit">kWh</span>
                        </div>
                        <div className="daily-report-grid-cell">
                            <label>Montant total électricité :</label>
                            {isReadOnly
                                ? <span className="daily-report-amount">{formatAmount(parseFloat(form.totalElectricityAmount) || 0)}</span>
                                : <input
                                    className="daily-report-value-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.totalElectricityAmount}
                                    onChange={setField("totalElectricityAmount")}
                                  />
                            }
                        </div>

                        <div className="daily-report-grid-cell">
                            <label>Nombre transactions automates :</label>
                            <input
                                className="daily-report-value-input daily-report-value-input--sm"
                                type="number"
                                min="0"
                                value={form.automatTransactionCount}
                                onChange={setField("automatTransactionCount")}
                                disabled={isReadOnly}
                                readOnly={isReadOnly}
                            />
                        </div>
                        <div className="daily-report-grid-cell">
                            <label>Nombre transactions caisse :</label>
                            <input
                                className="daily-report-value-input daily-report-value-input--sm"
                                type="number"
                                min="0"
                                value={form.cashierTransactionCount}
                                onChange={setField("cashierTransactionCount")}
                                disabled={isReadOnly}
                                readOnly={isReadOnly}
                            />
                        </div>

                        <div className="daily-report-grid-cell">
                            <label>Nombre transaction total :</label>
                            <span className="daily-report-value-box">{totalTransactions}</span>
                        </div>
                        <div className="daily-report-grid-cell">
                            <label>Montant total journalier :</label>
                            <span className="daily-report-amount">{formatAmount(totalAmount)}</span>
                        </div>
                    </div>
                </>
            )}

            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" type="button" onClick={closeModal}>
                    {mode === "view" ? "Fermer" : "Annuler"}
                </button>
                {mode !== "view" && (
                    <button
                        className="modal-button modal-button--confirm"
                        type="button"
                        onClick={handleConfirm}
                        disabled={!dto}
                    >
                        Valider
                    </button>
                )}
            </div>
        </div>
    );
};
