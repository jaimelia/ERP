import {type DragEvent, type FC, type JSX, useCallback, useRef} from "react";
import * as React from "react";
import type {WidgetDef} from "../types.ts";
import {WIDGETS} from "../data/stationConfig";

interface TileProps {
    widgetId: string;
    cols?: number;
    rows?: number;
    editingLayout: boolean;
    dragging: boolean;
    dragOver: boolean;
    onDragStart: () => void;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: () => void;
}

export const Tile: FC<TileProps> = ({
                                        widgetId,
                                        cols = 1,
                                        rows = 1,
                                        editingLayout,
                                        dragging,
                                        dragOver,
                                        onDragStart,
                                        onDragOver,
                                        onDragLeave,
                                        onDrop,
                                    }) => {
    const widget = WIDGETS[widgetId];
    const lastTargetRef = useRef<Element | null>(null);

    const classNames = [
        "tile",
        editingLayout ? "is-editing" : "",
        dragging ? "is-dragging" : "",
        dragOver ? "is-drag-over" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const renderWidgetContent = (widget: WidgetDef): JSX.Element => {
        if (widget.element) {
            return widget.element;
        }
        return <></>
    };

    // --- Touch handlers ---

    const handleTouchStart = () => {
        if (!editingLayout) return;
        onDragStart();
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!editingLayout) return;
        e.preventDefault(); // empêche le scroll pendant le drag

        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const tileEl = target?.closest("article.tile");

        // Si on entre sur une nouvelle tuile
        if (tileEl && tileEl !== lastTargetRef.current) {
            // Simuler dragLeave sur l'ancienne cible
            if (lastTargetRef.current) {
                lastTargetRef.current.dispatchEvent(new CustomEvent("tile-drag-leave", {bubbles: true}));
            }
            // Simuler dragOver sur la nouvelle cible
            tileEl.dispatchEvent(new CustomEvent("tile-drag-over", {bubbles: true}));
            lastTargetRef.current = tileEl;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!editingLayout) return;

        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const tileEl = target?.closest("article.tile");

        if (tileEl) {
            tileEl.dispatchEvent(new CustomEvent("tile-drop", {bubbles: true}));
        }

        if (lastTargetRef.current) {
            lastTargetRef.current.dispatchEvent(new CustomEvent("tile-drag-leave", {bubbles: true}));
            lastTargetRef.current = null;
        }
    };

    // --- Listeners pour les custom events touch ---

    const articleRef = useCallback(
        (node: HTMLElement | null) => {
            if (!node) return;

            const onOver = (e: Event) => onDragOver(e as unknown as DragEvent<HTMLDivElement>);

            node.addEventListener("tile-drag-over", onOver);
            node.addEventListener("tile-drag-leave", onDragLeave);
            node.addEventListener("tile-drop", onDrop);

            return () => {
                node.removeEventListener("tile-drag-over", onOver);
                node.removeEventListener("tile-drag-leave", onDragLeave);
                node.removeEventListener("tile-drop", onDrop);
            };
        },
        [onDragOver, onDragLeave, onDrop]
    );

    return (
        <article
            ref={articleRef}
            className={classNames}
            draggable={editingLayout}
            onDragStart={editingLayout ? onDragStart : undefined}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}

            style={{
                '--cols': cols,
                '--rows': rows,
                '--name': `'${widget.label}'`
            } as React.CSSProperties}
        >

            <div className="tile-content">
                {widget ? renderWidgetContent(widget) : <div className="tile-empty-content">-</div>}
            </div>
        </article>
    );
};