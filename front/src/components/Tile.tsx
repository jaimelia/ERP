import  {type DragEvent, type FC} from "react";
import {WIDGETS} from "../data/stationConfig";
import {Calculator} from "./Calculator.tsx";
import * as React from "react";
import {Products} from "./Products.tsx";

interface TileProps {
    widgetId: string;
    cols?: number;
    rows?: number;
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
        dragging ? "is-dragging" : "",
        dragOver ? "is-drag-over" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const renderWidgetContent = () => {
        switch (widgetId) {
            case "calculatrice":
                return <Calculator />;
            case "marchandises":
                return <Products />;
            default:
                return <div className="tile-subtitle">Contenu a venir</div>;
        }
    };

    return (
        <article 
            className={classNames} 
            onDragOver={onDragOver} 
            onDragLeave={onDragLeave} 
            onDrop={onDrop} 
            style={{'--cols': cols, '--rows': rows} as React.CSSProperties}>
            
            <div className="tile-drag-bar" draggable onDragStart={onDragStart}>
                <div className="tile-drag-info">
                    <svg className="tile-grip" width="12" height="12" viewBox="0 0 12 12" fill="none"
                         aria-hidden="true">
                        {[0, 4, 8].map(cx =>
                            [2, 6, 10].map(cy => <circle key={`${cx}-${cy}`} cx={cx + 2} cy={cy} r="1"
                                                         fill="currentColor"/>)
                        )}
                    </svg>
                    <span className="tile-drag-title">{widget?.label ?? "Widget"}</span>
                </div>
            </div>

            <div className="tile-content">
                {widget ? (
                    widget.id === "calculatrice" || widget.id === "marchandises" ? (
                        renderWidgetContent()
                    ) : (
                        <>
                            <div className={`tile-icon tile-icon--${widget.id}`}>{widget.icon}</div>
                            <div className="tile-title">{widget.label}</div>
                            {renderWidgetContent()}
                        </>
                    )
                ) : (
                    <div className="tile-empty-content">-</div>
                )}
            </div>
        </article>
    );
};
