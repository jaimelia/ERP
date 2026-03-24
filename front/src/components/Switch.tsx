import type {FC} from "react";

interface Props {
	id: string;
	onClick?: (enable: boolean) => void;
	checked?: boolean;
	disabled?: boolean;
}

export const Switch: FC<Props> = ({id, onClick, checked, disabled}: Props) => {

	return (
		<div className="toggle-switch">
			<input className="toggle-input" id={id} type="checkbox" checked={checked}
				   onChange={(e) => onClick?.(e.target.checked)}
				   disabled={disabled}/>
			<label className="toggle-label" htmlFor={id}></label>
		</div>
	)
}