import * as React from "react";
import {type DragEvent, type FC, type JSX, useCallback, useRef, useState} from "react";
import {buildGrid, getSize, SCREENS} from "../data/stationConfig";
import {type Coords, coordsEqual, coordsToKey, type ThemeKey, type User} from "../types";
import {Tile} from "./Tile";

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

                const sourceWidgetSize = getSize(sourceWidget);

                targetCoords.x -= Math.max(0, targetCoords.x + sourceWidgetSize.width - nextGrid[0].length);
                targetCoords.y -= Math.max(0, targetCoords.y + sourceWidgetSize.height - nextGrid.length);

                for (let dy = 0; dy < sourceWidgetSize.height; dy++) {
                    for (let dx = 0; dx < sourceWidgetSize.width; dx++) {
                        nextGrid[fromCoords.y + dy][fromCoords.x + dx] = nextGrid[targetCoords.y + dy][targetCoords.x + dx];
                    }
                }

                nextGrid[targetCoords.y][targetCoords.x] = sourceWidget;

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
