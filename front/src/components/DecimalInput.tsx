import React, {type ChangeEvent, useState} from 'react';

const DecimalInput: React.FC = () => {
    const [value, setValue] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        const regex = /^\d*(\.?\d{0,2})$/;

        if (regex.test(newValue)) {
            setValue(newValue);
        }
    };

    return (
        <>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Montant"
                required
                name="amount"
                className="ticket-amount-input"
            />
        </>
    );
};

export default DecimalInput;