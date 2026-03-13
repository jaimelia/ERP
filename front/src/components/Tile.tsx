import  {type DragEvent, type FC} from "react";
import {WIDGETS} from "../data/stationConfig";
import {ReapprovisionnementWidget} from "./widgets/ReapprovisionnementWidget";
import {MarchandisesWidget} from "./widgets/MarchandisesWidget";
import {CEEWidget} from "./widgets/CEEWidget";
import {TransactionsWidget} from "./widgets/TransactionsWidget";
import {ClientsWidget} from "./widgets/ClientsWidget";

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

const WIDGET_COMPONENTS: Partial<Record<string, FC>> = {
    reapprovisionnements_gerant: ReapprovisionnementWidget,
    reapprovisionnements_employe: ReapprovisionnementWidget,
    marchandises: MarchandisesWidget,
    CCE: CEEWidget,
    transactions: TransactionsWidget,
    clients: ClientsWidget,
};

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
    const WidgetFC = WIDGET_COMPONENTS[widgetId];

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
                    <span className="tile-drag-title">{widget?.label ?? widgetId}</span>
                </div>
            </div>

            {WidgetFC ? (
                <div className="tile-widget-content">
                    <WidgetFC />
                </div>
            ) : (
                <div className="tile-content">
                    {widget ? (
                        <>
                            <div className={`tile-icon tile-icon--${widget.id}`}>{widget.icon}</div>
                            <div className="tile-title">{widget.label}</div>
                            <div className="tile-subtitle">Contenu a venir</div>
                        </>
                    ) : (
                        <div className="tile-empty-content">-</div>
                    )}
                </div>
            )}
        </article>
    );
};
