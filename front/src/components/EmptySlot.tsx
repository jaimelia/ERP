import type {DragEvent, FC} from "react";

interface EmptySlotProps {
    dragOver: boolean;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: () => void;
}

export const EmptySlot: FC<EmptySlotProps> = ({dragOver, onDragOver, onDragLeave, onDrop}) => (
    <div
        className={`empty-slot ${dragOver ? "is-drag-over" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        {dragOver ? "↓ Deposer ici" : "-"}
    </div>
);
