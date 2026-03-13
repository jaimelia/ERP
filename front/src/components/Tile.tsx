import {type DragEvent, type FC, type JSX} from "react";
import {WIDGETS} from "../data/stationConfig.tsx";
import * as React from "react";
import type {WidgetDef} from "../types.ts";

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

    return (
        <article
            className={classNames}
            draggable={editingLayout}
            onDragStart={editingLayout ? onDragStart : undefined}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{'--cols': cols, '--rows': rows, '--name': `'${widget.label}'`} as React.CSSProperties}>

            <div className="tile-content">
                {widget
                    ? renderWidgetContent(widget)
                    : <div className="tile-empty-content">-</div>
                }
            </div>
        </article>
    );
};
