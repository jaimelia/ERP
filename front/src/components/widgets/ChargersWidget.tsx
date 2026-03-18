import  {type FC} from "react";
import {Switch} from "../Switch.tsx";



interface Charger {
    id: number;
    fast: boolean;
    status: "available" | "inUse" | "deactivated" | "outOfOrder";
}

const mockChargers: Charger[] = [
    {id: 1, fast: true, status: "available"},
    {id: 2, fast: true, status: "available"},
    {id: 3, fast: true, status: "inUse"},
    {id: 4, fast: true, status: "inUse"},
    {id: 5, fast: true, status: "available"},
    {id: 6, fast: true, status: "available"},
    {id: 7, fast: true, status: "outOfOrder"},
    {id: 8, fast: true, status: "available"},
    {id: 9, fast: false, status: "available"},
    {id: 10, fast: false, status: "available"}
]

export const ChargersWidget: FC = () => {
    
    const switchEnabled = (charger: Charger): boolean => {
        return charger.status === "available" || charger.status === "inUse";
    }
    
    return (
        <div className={"widget-container chargers-container"}>
            {mockChargers.map(charger => (
                <div className={"charger-row"}>
                    <div className={`status`} style={{"backgroundColor": `var(--status-${charger.status})`}} title={charger.status}></div>
                    Chargeur {charger.fast ? "rapide " : ""}{charger.id}
                    <Switch enabled={switchEnabled(charger)} id={`switch-${charger.id}`} onClick={(b) => console.log(b)} />
                </div>
            ))}
        </div>
    )
}