import {useCallback, useRef, useState, type DragEvent, type FC, type JSX} from "react";
import {SCREENS, buildGrid, getSize} from "../data/stationConfig";
import {type Coords, coordsEqual, coordsToKey, type ThemeKey, type User} from "../types";
import {EmptySlot} from "./EmptySlot";
import {Tile} from "./Tile";
import * as React from "react";

interface DashboardProps {
    screenKey: string;
    user: User;
    level: number;
    onLevel: (level: number) => void;
    onLogout: () => void;
    theme: ThemeKey;
    toggleTheme: () => void;
}

export const Dashboard: FC<DashboardProps> = ({screenKey, user, level, onLevel, onLogout, theme, toggleTheme}) => {
    const config = SCREENS[screenKey];
    const [grid, setGrid] = useState<(string | null)[][]>(() => buildGrid(screenKey));
    const [fromCoords, setFromCoords] = useState<Coords | null>(null);
    const [overCoords, setOverCoords] = useState<Coords | null>(null);
    const dragCounter = useRef<Record<string, number>>({});
    const isManager = user.role === "gerant";

    const handleDrop = useCallback(
        (targetCoords: Coords): void => {
            dragCounter.current = {};
            setOverCoords(null);
            setFromCoords(null);

            if (fromCoords === null || coordsEqual(fromCoords, targetCoords)) {
                return;
            }

            setGrid(previousGrid => {
                const nextGrid = previousGrid.map(row => [...row]);
                const sourceWidget = nextGrid[fromCoords.y][fromCoords.x];

                if (!sourceWidget) {
                    return nextGrid;
                }

                const rows = nextGrid.length;
                const cols = nextGrid[0]?.length ?? 0;
                const sourceSize = getSize(sourceWidget);

                const isInside = (coords: Coords, anchor: Coords, size: { width: number; height: number }): boolean =>
                    coords.x >= anchor.x
                    && coords.x < anchor.x + size.width
                    && coords.y >= anchor.y
                    && coords.y < anchor.y + size.height;

                const clampAnchor = (anchor: Coords, size: { width: number; height: number }): Coords => ({
                    x: Math.max(0, Math.min(anchor.x, cols - size.width)),
                    y: Math.max(0, Math.min(anchor.y, rows - size.height)),
                });

                let targetAnchor: Coords | null = null;
                let targetWidget: string | null = null;
                let targetSize = { width: 0, height: 0 };

                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        const widgetId = nextGrid[y][x];
                        if (!widgetId) {
                            continue;
                        }

                        const size = getSize(widgetId);
                        if (isInside(targetCoords, { x, y }, size)) {
                            targetAnchor = { x, y };
                            targetWidget = widgetId;
                            targetSize = size;
                            break;
                        }
                    }

                    if (targetAnchor) {
                        break;
                    }
                }

                if (targetAnchor && coordsEqual(targetAnchor, fromCoords)) {
                    return nextGrid;
                }

                if (!targetAnchor && isInside(targetCoords, fromCoords, sourceSize)) {
                    return nextGrid;
                }

                const adjustedSourceAnchor = clampAnchor(targetCoords, sourceSize);
                const adjustedTargetAnchor = targetWidget ? clampAnchor(fromCoords, targetSize) : null;

                if (!targetWidget && coordsEqual(adjustedSourceAnchor, fromCoords)) {
                    return nextGrid;
                }

                if (targetWidget && adjustedTargetAnchor && coordsEqual(adjustedSourceAnchor, adjustedTargetAnchor)) {
                    return nextGrid;
                }

                const occupied = Array.from({ length: rows }, () => Array(cols).fill(false));
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        const widgetId = nextGrid[y][x];
                        if (!widgetId) {
                            continue;
                        }

                        if (coordsEqual({ x, y }, fromCoords)) {
                            continue;
                        }

                        if (targetAnchor && coordsEqual({ x, y }, targetAnchor)) {
                            continue;
                        }

                        const size = getSize(widgetId);
                        for (let dy = 0; dy < size.height; dy++) {
                            for (let dx = 0; dx < size.width; dx++) {
                                occupied[y + dy][x + dx] = true;
                            }
                        }
                    }
                }

                const canPlace = (anchor: Coords, size: { width: number; height: number }): boolean => {
                    if (anchor.x < 0 || anchor.y < 0) {
                        return false;
                    }

                    if (anchor.x + size.width > cols || anchor.y + size.height > rows) {
                        return false;
                    }

                    for (let dy = 0; dy < size.height; dy++) {
                        for (let dx = 0; dx < size.width; dx++) {
                            if (occupied[anchor.y + dy][anchor.x + dx]) {
                                return false;
                            }
                        }
                    }

                    return true;
                };

                if (!canPlace(adjustedSourceAnchor, sourceSize)) {
                    return nextGrid;
                }

                for (let dy = 0; dy < sourceSize.height; dy++) {
                    for (let dx = 0; dx < sourceSize.width; dx++) {
                        occupied[adjustedSourceAnchor.y + dy][adjustedSourceAnchor.x + dx] = true;
                    }
                }

                if (targetWidget && adjustedTargetAnchor) {
                    if (!canPlace(adjustedTargetAnchor, targetSize)) {
                        return nextGrid;
                    }

                    for (let dy = 0; dy < targetSize.height; dy++) {
                        for (let dx = 0; dx < targetSize.width; dx++) {
                            occupied[adjustedTargetAnchor.y + dy][adjustedTargetAnchor.x + dx] = true;
                        }
                    }
                }

                nextGrid[fromCoords.y][fromCoords.x] = null;
                if (targetAnchor) {
                    nextGrid[targetAnchor.y][targetAnchor.x] = null;
                }

                nextGrid[adjustedSourceAnchor.y][adjustedSourceAnchor.x] = sourceWidget;
                if (targetWidget && adjustedTargetAnchor) {
                    nextGrid[adjustedTargetAnchor.y][adjustedTargetAnchor.x] = targetWidget;
                }

                return nextGrid;
            });
        },
        [fromCoords]
    );

    const widgets: JSX.Element[] = [];
    const skips = new Set<string>();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const coords: Coords = { x, y };
            
            if (skips.has(coordsToKey(coords))) {
                continue;
            }
            
            const widgetId = grid[y][x];
            const size = getSize(widgetId);

            for (let dy = 0; dy < size.height; dy++) {
                for (let dx = 0; dx < size.width; dx++) {
                    if (dx !== 0 || dy !== 0) {
                        skips.add(coordsToKey({ x: x + dx, y: y + dy }));
                    }
                }
            }

            const incrementCounter = (key: string): void => {
                dragCounter.current[key] = (dragCounter.current[key] ?? 0) + 1;
                setOverCoords(coords);
            };

            const decrementCounter = (key: string): void => {
                dragCounter.current[key] = Math.max(0, (dragCounter.current[key] ?? 1) - 1);
                if (!dragCounter.current[key]) {
                    setOverCoords(current => coordsEqual(current, coords) ? null : current);
                }
            };

            const onDragOver = (event: DragEvent<HTMLDivElement>): void => {
                event.preventDefault();
                incrementCounter(coordsToKey(coords));
            };

            const onDragLeave = (): void => {
                decrementCounter(coordsToKey(coords));
            };

            const onDrop = (): void => {
                handleDrop(coords);
            };

            if (widgetId) {
                widgets.push(
                    <Tile
                        key={`tile-${x}-${y}-${widgetId}`}
                        widgetId={widgetId}
                        cols={size.width}
                        rows={size.height}
                        dragging={coordsEqual(fromCoords, coords)}
                        dragOver={coordsEqual(overCoords, coords)}
                        onDragStart={() => setFromCoords(coords)}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    />
                );
            } else {
                widgets.push(
                    <EmptySlot
                        key={`empty-${x}-${y}`}
                        dragOver={coordsEqual(overCoords, coords)}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    />
                );
            }
        }
    }

    return (
        <div className="dashboard-screen">
            <header className="dashboard-header">
                <div className="header-left-group">
                    <div className="header-brand">
                        <span className="header-brand-icon">⛽</span>
                        <span className="header-brand-name">StationOS</span>
                    </div>
                    <div className="header-divider"/>
                    <span className="header-view-label">{config.label}</span>
                </div>

                <div className="header-right-group">
                    {[1, 2].map(candidateLevel => (
                        <button
                            key={candidateLevel}
                            type="button"
                            className={`header-level-button ${level === candidateLevel ? "is-active" : ""}`}
                            onClick={() => onLevel(candidateLevel)}
                        >
                            Niveau {candidateLevel}
                        </button>
                    ))}

                    <div className="header-divider"/>
                    <span className={`header-role-badge ${isManager ? "is-manager" : "is-employee"}`}>
                        {isManager ? "Gerant" : "Employe"}
                    </span>
                    <span className="header-user-name">{user.name}</span>

                    <button
                        type="button"
                        className="header-icon-button"
                        onClick={toggleTheme}
                        aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    <button type="button" className="header-logout-button" onClick={onLogout}>
                        Deconnexion
                    </button>
                </div>
            </header>

            <main>
                <div className={`dashboard-grid`} style={{'--cols': config.defaultGrid[0].length, '--rows': config.defaultGrid.length} as React.CSSProperties}>
                    {widgets}
                </div>
            </main>
        </div>
    );
};
