import {type FC} from "react";
import {Switch} from "../Switch.tsx";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {apiUrl} from "../../api/common.ts";

interface Charger {
	idEvCharger: number;
	isFast: boolean;
	status: "available" | "inUse" | "deactivated" | "outOfOrder";
}

export const ChargersWidget: FC = () => {

	const {data: chargers, setData: setChargers, loading, error} = useFetch<Charger[]>(
		apiUrl("/chargers"),
		5000
	);

	const isSwitchChecked = (charger: Charger): boolean => {
		return charger.status === "available" || charger.status === "inUse";
	}

	const handleSwitchClick = (checked: boolean, charger: Charger): void => {
		let newStatus: Charger["status"] | null = null;

		switch (charger.status) {
			case "available":
			case "inUse":
				if (!checked) newStatus = "deactivated";
				break;
			case "deactivated":
				if (checked) newStatus = "available";
				break;
		}

		if (newStatus === null) return;

		setChargers(prev => prev
			? prev.map(c => c.idEvCharger === charger.idEvCharger ? {...c, status: newStatus!} : c)
			: prev
		);
	}

	return (
		<FetchWrapper loading={loading} error={error}>
			<div className="widget-container chargers-container">
				{chargers?.map(charger => (
					<div key={charger.idEvCharger} className="charger-row">
						<div className="status" style={{"backgroundColor": `var(--status-${charger.status})`}}
							 title={charger.status}></div>
						Chargeur {charger.isFast ? "rapide " : ""}{charger.idEvCharger}
						<Switch checked={isSwitchChecked(charger)} id={`switch-${charger.idEvCharger}`}
								onClick={(enabled) => handleSwitchClick(enabled, charger)}
								disabled={charger.status === "outOfOrder"}/>
					</div>
				))}
			</div>
		</FetchWrapper>
	)
}