import type {FC} from "react";

interface Props {
    id: string;
    onClick?: (enable: boolean) => void;
    enabled?: boolean;
}

export const Switch: FC<Props> = ({id, onClick, enabled}: Props) => {
    
    return (
        <div className="toggle-switch">
            <input className="toggle-input" id={id} type="checkbox" checked={enabled} onChange={(e) => onClick?.(e.target.checked)}/>
            <label className="toggle-label" htmlFor={id}></label>
        </div>
    )
}