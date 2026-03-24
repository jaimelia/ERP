import { type FC, useCallback, useState } from "react";
import { Switch } from "../Switch.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FuelLevel {
    type: string;
    currentLevel: number;
    maxLevel: number | null;
}

interface ActiveTransaction {
    volumeL: number;
    amountEur: number;
}

type PumpStatus = "available" | "inUse" | "outOfOrder" | "deactivated";

interface Pump {
    id: number;
    isAutomate: boolean;
    status: PumpStatus;
    fuelLevels: FuelLevel[];
    activeTransaction: ActiveTransaction | null;
    enabled: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: remplacer par un appel API — GET /api/pumps
// Réponse attendue : Pump[]

const MOCK_PUMPS: Pump[] = [
    {
        id: 1,
        isAutomate: true,
        status: "available",
        fuelLevels: [
            { type: "Diesel", currentLevel: 1700, maxLevel: 2400 },
            { type: "SP-95", currentLevel: 500, maxLevel: 2400 },
        ],
        activeTransaction: null,
        enabled: true,
    },
    {
        id: 2,
        isAutomate: true,
        status: "inUse",
        fuelLevels: [
            { type: "Diesel", currentLevel: 2300, maxLevel: 2400 },
            { type: "SP-95", currentLevel: 2100, maxLevel: 2400 },
        ],
        activeTransaction: { volumeL: 12.24, amountEur: 20.07 },
        enabled: true,
    },
    {
        id: 3,
        isAutomate: false,
        status: "available",
        fuelLevels: [
            { type: "Diesel", currentLevel: 1100, maxLevel: 2400 },
            { type: "SP-95", currentLevel: 2350, maxLevel: 2400 },
        ],
        activeTransaction: null,
        enabled: true,
    },
    {
        id: 4,
        isAutomate: false,
        status: "outOfOrder",
        fuelLevels: [
            { type: "Diesel", currentLevel: 1700, maxLevel: null },
            { type: "SP-95", currentLevel: 1250, maxLevel: null },
        ],
        activeTransaction: null,
        enabled: false,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getFuelFillClass = (current: number, max: number): string => {
    const ratio = current / max;
    if (ratio > 0.5) return "pump-fuel-fill pump-fuel-fill--high";
    if (ratio > 0.25) return "pump-fuel-fill pump-fuel-fill--medium";
    return "pump-fuel-fill pump-fuel-fill--low";
};

// ─── Sub-component: PumpCard ──────────────────────────────────────────────────

interface PumpCardProps {
    pump: Pump;
    onToggle: (id: number, enabled: boolean) => void;
    onPay: (id: number) => void;
}

const PumpCard: FC<PumpCardProps> = ({ pump, onToggle, onPay }) => {
    const showPayButton = !pump.isAutomate && pump.status !== "outOfOrder";

    return (
        <div className="pump-card">
            {/* En-tête : indicateur de statut + numéro */}
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

            {/* Niveaux de carburant */}
            <div className="pump-fuel-levels">
                {pump.fuelLevels.map((fuel) => (
                    <div key={fuel.type} className="pump-fuel-row">
                        <span className="pump-fuel-type">{fuel.type}</span>
                        {fuel.maxLevel !== null ? (
                            <>
                                <div className="pump-fuel-bar">
                                    <div
                                        className={getFuelFillClass(
                                            fuel.currentLevel,
                                            fuel.maxLevel
                                        )}
                                        style={{
                                            width: `${(fuel.currentLevel / fuel.maxLevel) * 100}%`,
                                        }}
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

            {/* Transaction en cours */}
            <div className="pump-transaction">
                <span className="pump-transaction-title">En cours:</span>
                {pump.activeTransaction ? (
                    <div className="pump-transaction-values">
                        <span>{pump.activeTransaction.volumeL.toFixed(2)}L</span>
                        <span>{pump.activeTransaction.amountEur.toFixed(2)}€</span>
                    </div>
                ) : (
                    <span className="pump-transaction-empty">—</span>
                )}
            </div>

            {/* Pied de carte : bouton payer + interrupteur */}
            <div className="pump-card-footer">
                {showPayButton && (
                    <button
                        className="pump-pay-btn"
                        onClick={() => onPay(pump.id)}
                    >
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
    // TODO: remplacer MOCK_PUMPS par un appel API
    // const [pumps, setPumps] = useState<Pump[]>([]);
    // useEffect(() => {
    //     fetch("/api/pumps")
    //         .then(res => res.json())
    //         .then(data => setPumps(data));
    // }, []);
    const [pumps, setPumps] = useState<Pump[]>(MOCK_PUMPS);

    const handleToggle = useCallback((pumpId: number, enabled: boolean) => {
        // TODO: PATCH /api/pumps/{pumpId}/enabled  →  body: { enabled }
        setPumps((prev) =>
            prev.map((p) => (p.id === pumpId ? { ...p, enabled } : p))
        );
    }, []);

    const handlePay = useCallback((pumpId: number) => {
        // TODO: POST /api/pumps/{pumpId}/payment
        console.log("Payer pompe", pumpId);
    }, []);

    return (
        <div className="widget-container pumps-container">
            <div className="pumps-grid">
                {pumps.map((pump) => (
                    <PumpCard
                        key={pump.id}
                        pump={pump}
                        onToggle={handleToggle}
                        onPay={handlePay}
                    />
                ))}
            </div>
        </div>
    );
};
