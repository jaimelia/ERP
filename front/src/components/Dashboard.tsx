import * as React from "react";
import {type DragEvent, type FC, type JSX, useCallback, useRef, useState} from "react";
import {getSize} from "../data/stationConfig.tsx";
import {type Coords, coordsEqual, coordsToKey, type Levels, type ThemeKey, type User} from "../types";
import {Tile} from "./Tile";
import {savePreferences} from "../api/userApi.ts";

interface DashboardProps {
    user: User;
    level: number;
	levels: Levels
	onSaveLevels: (levels: Levels) => void;
    onLevel: (level: number) => void;
    onLogout: () => void;
    editingLayout: boolean;
    onEditLayout: (editingLayout: boolean) => void;
    theme: ThemeKey;
    toggleTheme: () => void;
}

export const Dashboard: FC<DashboardProps> = ({user, level, levels, onSaveLevels, onLevel, onLogout, editingLayout, onEditLayout, theme, toggleTheme}) => {
    const [fromCoords, setFromCoords] = useState<Coords | null>(null);
    const [overCoords, setOverCoords] = useState<Coords | null>(null);
    const dragCounter = useRef<Record<string, number>>({});
    const isManager = user.role === "gerant";

	const handleDrop = useCallback(
		(targetCoords: Coords): void => {
			dragCounter.current = {};
			setOverCoords(null);
			setFromCoords(null);

			if (fromCoords === null || coordsEqual(fromCoords, targetCoords)) return;

			const nextGrid = (() => {
				const next = levels[level - 1].map(row => [...row]);
				const sourceWidget = next[fromCoords.y][fromCoords.x];
				const sourceSize = getSize(sourceWidget);
				const targetWidget = next[targetCoords.y][targetCoords.x];
				const targetSize = getSize(targetWidget);

				const srcDestX = Math.min(targetCoords.x, next[0].length - sourceSize.width);
				const srcDestY = Math.min(targetCoords.y, next.length - sourceSize.height);
				const tgtDestX = Math.min(fromCoords.x, next[0].length - targetSize.width);
				const tgtDestY = Math.min(fromCoords.y, next.length - targetSize.height);

				const affected = new Set<string>();
				const collateral: string[] = [];

				const markCells = (x: number, y: number, w: number, h: number): void => {
					for (let dy = 0; dy < h; dy++)
						for (let dx = 0; dx < w; dx++)
							affected.add(`${x + dx},${y + dy}`);
				};

				markCells(fromCoords.x, fromCoords.y, sourceSize.width, sourceSize.height);
				markCells(targetCoords.x, targetCoords.y, targetSize.width, targetSize.height);

				for (let dy = 0; dy < targetSize.height; dy++) {
					for (let dx = 0; dx < targetSize.width; dx++) {
						const cx = tgtDestX + dx, cy = tgtDestY + dy;
						const key = `${cx},${cy}`;
						if (!affected.has(key)) {
							const w = next[cy][cx];
							if (w !== null) collateral.push(w);
							const cs = getSize(w);
							markCells(cx, cy, cs.width, cs.height);
						}
					}
				}

				for (let dy = 0; dy < sourceSize.height; dy++) {
					for (let dx = 0; dx < sourceSize.width; dx++) {
						const cx = srcDestX + dx, cy = srcDestY + dy;
						const key = `${cx},${cy}`;
						if (!affected.has(key)) {
							const w = next[cy][cx];
							if (w !== null) collateral.push(w);
							const cs = getSize(w);
							markCells(cx, cy, cs.width, cs.height);
						}
					}
				}

				for (const key of affected) {
					const [x, y] = key.split(",").map(Number);
					next[y][x] = null;
				}

				next[srcDestY][srcDestX] = sourceWidget;
				next[tgtDestY][tgtDestX] = targetWidget;

				const used = new Set<string>();
				for (let dy = 0; dy < sourceSize.height; dy++)
					for (let dx = 0; dx < sourceSize.width; dx++)
						used.add(`${srcDestX + dx},${srcDestY + dy}`);
				for (let dy = 0; dy < targetSize.height; dy++)
					for (let dx = 0; dx < targetSize.width; dx++)
						used.add(`${tgtDestX + dx},${tgtDestY + dy}`);

				const freeCells: Coords[] = [];
				for (const key of affected) {
					if (!used.has(key)) {
						const [x, y] = key.split(",").map(Number);
						freeCells.push({x, y});
					}
				}

				for (let i = 0; i < collateral.length && i < freeCells.length; i++) {
					next[freeCells[i].y][freeCells[i].x] = collateral[i];
				}

				return next;
			})();
			
			const nextLevels = levels.map((l, i) => i === level - 1 ? nextGrid : l)
			onSaveLevels(nextLevels)
			
			savePreferences({
				tileLayout: nextLevels
			});
		},
		[fromCoords, onSaveLevels, level, levels]
	);

    const widgets: JSX.Element[] = [];
    const skips = new Set<string>();

    for (let y = 0; y < levels[level - 1].length; y++) {
        for (let x = 0; x < levels[level - 1][y].length; x++) {
            const coords: Coords = { x, y };
            
            if (skips.has(coordsToKey(coords))) {
                continue;
            }
            
            const widgetId = levels[level - 1][y][x];
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
                        editingLayout={editingLayout}
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
                    <button 
                        type="button"
                        className={`header-button ${editingLayout ? "is-active" : ""}`} 
                        onClick={() => onEditLayout(!editingLayout)}
                    >
                        Mode déplacement
                    </button>
                </div>

                <div className="header-right-group">
                    {[1, 2].map(candidateLevel => (
                        <button
                            key={candidateLevel}
                            type="button"
                            className={`header-button ${level === candidateLevel ? "is-active" : ""}`}
                            onClick={() => onLevel(candidateLevel)}
                        >
                            Niveau {candidateLevel}
                        </button>
                    ))}

                    <div className="header-divider"/>
                    <span className={`header-role-badge ${isManager ? "is-manager" : "is-employee"}`}>
                        {isManager ? "Gerant" : "Employe"}
                    </span>
                    <span className="header-user-name">{user.username}</span>

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
                <div className={`dashboard-grid`} style={{'--cols': levels[level - 1][0].length, '--rows': levels[level - 1].length} as React.CSSProperties}>
                    {widgets}
                </div>
            </main>
        </div>
    );
};
