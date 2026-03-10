import {useCallback, useRef, useState, type DragEvent, type FC, type JSX} from "react";
import {SCREENS, buildGrid, } from "../data/stationConfig";
import type {ThemeKey, User} from "../types";
import {EmptySlot} from "./EmptySlot";
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
    const [grid, setGrid] = useState<(string | null)[]>(() => buildGrid(screenKey));
    const [fromIndex, setFromIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const dragCounter = useRef<Record<number, number>>({});
    const isManager = user.role === "gerant";

    const handleDrop = useCallback(
        (targetIndex: number): void => {
            dragCounter.current = {};
            setOverIndex(null);
            setFromIndex(null);

            if (fromIndex === null || fromIndex === targetIndex) {
                return;
            }

            setGrid(previousGrid => {
                const nextGrid = [...previousGrid];
                const sourceWidget = nextGrid[fromIndex];
                const targetWidget = nextGrid[targetIndex];

                if (isWide(sourceWidget) || isWide(targetWidget)) {
                    nextGrid[fromIndex] = targetWidget;
                    nextGrid[targetIndex] = sourceWidget;

                    const sourceRightCell = fromIndex + 1;
                    const targetRightCell = targetIndex + 1;

                    if (
                        sourceRightCell < nextGrid.length &&
                        targetRightCell < nextGrid.length &&
                        sourceRightCell !== targetIndex &&
                        targetRightCell !== fromIndex
                    ) {
                        const swapBuffer = nextGrid[sourceRightCell];
                        nextGrid[sourceRightCell] = nextGrid[targetRightCell];
                        nextGrid[targetRightCell] = swapBuffer;
                    }
                } else {
                    nextGrid[fromIndex] = targetWidget;
                    nextGrid[targetIndex] = sourceWidget;
                }

                return nextGrid;
            });
        },
        [fromIndex]
    );

    const widgets: JSX.Element[] = [];
    let skipNext = false;

    for (let index = 0; index < grid.length; index++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        const widgetId = grid[index];
        const wide = isWide(widgetId);
        if (wide) {
            skipNext = true;
        }

        const incrementCounter = (cellIndex: number): void => {
            dragCounter.current[cellIndex] = (dragCounter.current[cellIndex] ?? 0) + 1;
            setOverIndex(cellIndex);
        };

        const decrementCounter = (cellIndex: number): void => {
            dragCounter.current[cellIndex] = Math.max(0, (dragCounter.current[cellIndex] ?? 1) - 1);
            if (!dragCounter.current[cellIndex]) {
                setOverIndex(currentOverIndex => (currentOverIndex === cellIndex ? null : currentOverIndex));
            }
        };

        const onDragOver = (event: DragEvent<HTMLDivElement>): void => {
            event.preventDefault();
            incrementCounter(index);
        };

        const onDragLeave = (): void => {
            decrementCounter(index);
        };

        const onDrop = (): void => {
            handleDrop(index);
        };

        if (widgetId) {
            widgets.push(
                <Tile
                    key={`tile-${index}-${widgetId}`}
                    widgetId={widgetId}
                    colSpan={wide ? 2 : 1}
                    dragging={fromIndex === index}
                    dragOver={overIndex === index}
                    onDragStart={() => setFromIndex(index)}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                />
            );
        } else {
            widgets.push(
                <EmptySlot
                    key={`empty-${index}`}
                    dragOver={overIndex === index}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                />
            );
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
                <div className={`dashboard-grid dashboard-grid--${config.cols}x${config.rows}`}>
                    {widgets}
                </div>
            </main>
        </div>
    );
};
