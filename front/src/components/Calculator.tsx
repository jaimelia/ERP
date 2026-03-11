import {useState, type FC} from "react";

export const Calculator: FC = () => {
    const [currentValue, setCurrentValue] = useState<string>("0");
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);

    const addDigit = (digit: string): void => {
        if (waitingForNewValue) {
            setCurrentValue(digit);
            setWaitingForNewValue(false);
        } else {
            if (digit === "." && currentValue.includes(".")) {
                return;
            }

            if (currentValue === "0" && digit !== ".") {
                setCurrentValue(digit);
            } else {
                setCurrentValue(currentValue + digit);
            }
        }
    };

    const chooseOperator = (op: string): void => {
        if (operator && !waitingForNewValue) {
            calculate();
        } else {
            setPreviousValue(currentValue);
        }
        setOperator(op);
        setWaitingForNewValue(true);
    };

    const calculate = (): void => {
        if (!operator || !previousValue) return;

        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        let result = 0;

        switch (operator) {
            case "+":
                result = prev + current;
                break;
            case "-":
                result = prev - current;
                break;
            case "x":
                result = prev * current;
                break;
            case "÷":
                if (current === 0) {
                    setCurrentValue("Erreur");
                    setOperator(null);
                    setPreviousValue(null);
                    setWaitingForNewValue(true);
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        setCurrentValue(String(Math.round(result * 10000000) / 10000000));
        setOperator(null);
        setPreviousValue(null);
        setWaitingForNewValue(true);
    };

    const clearAll = (): void => {
        setCurrentValue("0");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    const deleteLast = (): void => {
        setCurrentValue(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    };

    const toggleSign = (): void => {
        setCurrentValue(prev => String(parseFloat(prev) * -1));
    };

    const percentage = (): void => {
        setCurrentValue(prev => String(parseFloat(prev) / 100));
    };

    const keys = [
        "CE", "←", "%", "+",
        "7", "8", "9", "-",
        "4", "5", "6", "x",
        "1", "2", "3", "÷",
        "0", "±", ".", "="
    ];

    return (
        <div className="widget-calculator">
            <div className="calculator-screen">{currentValue}</div>
            <div className="calculator-grid">
                {keys.map(key => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => {
                            if (key === "CE") clearAll();
                            else if (key === "←") deleteLast();
                            else if (key === "±") toggleSign();
                            else if (key === "%") percentage();
                            else if (key === "=") calculate();
                            else if (["+", "-", "x", "÷"].includes(key)) chooseOperator(key);
                            else addDigit(key);
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
};