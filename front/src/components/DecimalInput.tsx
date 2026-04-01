import React, {type ChangeEvent, type ChangeEventHandler, useState} from 'react';

interface DecimalInputProps {
	id?: string;
	onChange?: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
	nbDecimalPlaces?: number;
	placeHolder?: string;
	initialValue?: string | number;
}

const DecimalInput: React.FC<DecimalInputProps> = ({id, onChange, nbDecimalPlaces, placeHolder, initialValue}: DecimalInputProps) => {
    const [value, setValue] = useState<string>(initialValue ? String(initialValue) : "");

	const places = Math.max(0, nbDecimalPlaces ?? 2);
	const regex = new RegExp(`^\\d*(\\.?\\d{0,${places}})$`);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(e);

        const newValue = e.target.value;

        if (regex.test(newValue)) {
            setValue(newValue);
        }
    };

    return (
        <>
            <input
                type="text"
				id={id ?? ""}
                value={value}
                onChange={handleChange}
                placeholder={placeHolder ?? ""}
                required
                name="amount"
                className="ticket-amount-input"
            />
        </>
    );
};

export default DecimalInput;