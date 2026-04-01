import {type FC, useCallback} from "react";
import {Switch} from "../Switch.tsx";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {useToast} from "../../contexts/ToastContext.tsx";
import {type PumpDTO, togglePumpEnabled} from "../../api/pumpsApi.ts";
import {apiUrl} from "../../api/common.ts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getFuelFillClass = (current: number, max: number): string => {
    const ratio = current / max;
    if (ratio > 0.5) return "pump-fuel-fill pump-fuel-fill--high";
    if (ratio > 0.25) return "pump-fuel-fill pump-fuel-fill--medium";
    return "pump-fuel-fill pump-fuel-fill--low";
};

// ─── Sub-component: PumpCard ──────────────────────────────────────────────────

interface PumpCardProps {
    pump: PumpDTO;
    onToggle: (id: number, enabled: boolean) => void;
}

const PumpCard: FC<PumpCardProps> = ({ pump, onToggle }) => {
    const showPayButton = !pump.isAutomate && pump.status !== "outOfOrder";

    return (
        <div className="pump-card">
            <div className="pump-card-header">
                <div
                    className="status pump-status-dot"
                    style={{ backgroundColor: `var(--status-${pump.status})` }}
                    title={pump.status}
                />
                <span className="pump-name">
                    {pump.id}
                    {pump.isAutomate && (
                        <span className="pump-automate-label"> (Automate)</span>
                    )}
                </span>
            </div>

            <div className="pump-fuel-levels">
                {pump.fuelLevels.map((fuel) => (
                    <div key={fuel.type} className="pump-fuel-row">
                        <span className="pump-fuel-type">{fuel.type}</span>
                        {fuel.maxLevel !== null ? (
                            <>
                                <div className="pump-fuel-bar">
                                    <div
                                        className={getFuelFillClass(fuel.currentLevel, fuel.maxLevel)}
                                        style={{ width: `${(fuel.currentLevel / fuel.maxLevel) * 100}%` }}
                                    />
                                </div>
                                <span className="pump-fuel-label">
                                    {fuel.currentLevel}L/{fuel.maxLevel}L
                                </span>
                            </>
                        ) : (
                            <span className="pump-fuel-label pump-fuel-label--no-max">
                                {fuel.currentLevel}L
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="pump-transaction">
                <span className="pump-transaction-title">En cours:</span>
                {pump.inUseAt ? (
                    <span className="pump-transaction-values">{pump.inUseAt}</span>
                ) : (
                    <span className="pump-transaction-empty">—</span>
                )}
            </div>

            <div className="pump-card-footer">
                {showPayButton && (
                    <button className="pump-pay-btn" disabled>
                        Payer
                    </button>
                )}
                <div className="pump-toggle">
                    <Switch
                        id={`pump-switch-${pump.id}`}
                        checked={pump.enabled}
                        onClick={(enabled) => onToggle(pump.id, enabled)}
                    />
                </div>
            </div>
        </div>
    );
};

// ─── Widget principal ─────────────────────────────────────────────────────────

export const PumpsWidget: FC = () => {
    const { data: pumps, loading, error, setData: setPumps } =
        useFetch<PumpDTO[]>(apiUrl("/pumps"), 10000);
    const { error: toastError } = useToast();

    const handleToggle = useCallback(async (pumpId: number, enabled: boolean) => {
        setPumps(prev => prev?.map(p => p.id === pumpId ? { ...p, enabled } : p) ?? prev);
        try {
            await togglePumpEnabled(pumpId, enabled);
        } catch {
            toastError("Impossible de modifier l'état de la pompe.");
            setPumps(prev => prev?.map(p => p.id === pumpId ? { ...p, enabled: !enabled } : p) ?? prev);
        }
    }, [setPumps, toastError]);

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container pumps-container">
                <div className="pumps-grid">
                    {(pumps ?? []).map((pump) => (
                        <PumpCard
                            key={pump.id}
                            pump={pump}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            </div>
        </FetchWrapper>
    );
};
