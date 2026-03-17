import {useState, type FC} from "react";

export const Calculator: FC = () => {
    const [currentValue, setCurrentValue] = useState<string>("0");
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
    const [operationDisplay, setOperationDisplay] = useState<string>("");
    const MAX_DIGITS = 15;
    const formatNumericString = (value: string): string => {
        if (value === "" || value === "Erreur") return value;
        let sign = "";
        let raw = value;
        if (raw.startsWith("-")) {
            sign = "-";
            raw = raw.slice(1);
        }

        const hasDot = raw.includes(".");
        const [intPart, fracPart = ""] = raw.split(".");
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `${sign}${formattedInt}${hasDot ? "." + fracPart : ""}`;
    };
    const formatExpression = (expr: string): string =>
        expr.replace(/-?\d+(?:\.\d*)?/g, match => formatNumericString(match));

    const addDigit = (digit: string): void => {
        if (waitingForNewValue) {
            if (!operator && !previousValue && operationDisplay.endsWith("=")) {
                setOperationDisplay("");
            }
            setCurrentValue(digit);
            setWaitingForNewValue(false);
        } else {
            if (digit === "." && currentValue.includes(".")) {
                return;
            }

            const digitCount = currentValue.replace(/[^0-9]/g, "").length;
            if (digit !== "." && digitCount >= MAX_DIGITS) {
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
        if (operator && !waitingForNewValue && previousValue) {
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
                        setOperationDisplay(`${previousValue} ${operator} ${currentValue} =`);
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

            const formattedResult = String(Math.round(result * 10000000) / 10000000);
            setCurrentValue(formattedResult);
            setPreviousValue(formattedResult);
            setOperator(op);
            setWaitingForNewValue(true);
            setOperationDisplay(`${formattedResult} ${op}`);
            return;
        }

        setPreviousValue(currentValue);
        setOperator(op);
        setWaitingForNewValue(true);
        setOperationDisplay(`${currentValue} ${op}`);
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
                    setOperationDisplay(`${previousValue} ${operator} ${currentValue} =`);
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

        setOperationDisplay(`${previousValue} ${operator} ${currentValue} =`);
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
        setOperationDisplay("");
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
            <div className="calculator-screen">
                <div className="calculator-operation">{formatExpression(operationDisplay)}</div>
                <div className="calculator-current">{formatNumericString(currentValue)}</div>
            </div>
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
