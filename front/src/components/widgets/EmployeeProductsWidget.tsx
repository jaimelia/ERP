import {type FC, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {apiUrl} from "../../api/common.ts";
import {type ElectricityDTO, type ItemDTO,} from "../../api/itemsApi.ts";

// ─── Types internes ───────────────────────────────────────────────────────────

type ElectricityItem = ElectricityDTO & { itemType: "electricity" };
type ManagerItem = ItemDTO | ElectricityItem;
type ItemFilter = "all" | "product" | "fuel" | "electricity";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isElectricityItem(item: ManagerItem): item is ElectricityItem {
	return item.itemType === "electricity";
}

function typeLabel(type: ManagerItem["itemType"]): string {
	switch (type) {
		case "product":
			return "Produit";
		case "fuel":
			return "Carburant";
		case "electricity":
			return "Électricité";
		default:
			return type;
	}
}

// ─── Composant ────────────────────────────────────────────────────────────────

export const EmployeeProductsWidget: FC = () => {
	const { data: items, loading: itemsLoading, error: itemsError } =
		useFetch<ItemDTO[]>(apiUrl("/items/stock"));
	const { data: electricity, loading: electricityLoading, error: electricityError } =
		useFetch<ElectricityDTO[]>(apiUrl("/items/electricity"));

	const [search, setSearch]  = useState("");
	const [filter, setFilter]  = useState<ItemFilter>("all");

	// ── Filtrage ──────────────────────────────────────────────────────────────

	const managerItems: ManagerItem[] = [
		...(items ?? []),
		...(electricity ?? []).map(e => ({ ...e, itemType: "electricity" as const })),
	];

	const filtered = managerItems.filter(m =>
		m.name.toLowerCase().includes(search.toLowerCase()) &&
		(filter === "all" || m.itemType === filter)
	);

	// ── Rendu ─────────────────────────────────────────────────────────────────

	return (
		<FetchWrapper loading={itemsLoading || electricityLoading} error={itemsError ?? electricityError}>
			<div className="widget-container">

				{/* Toolbar */}
				<div className="widget-toolbar">
					<div className="widget-search">
						<svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
							<circle cx="11" cy="11" r="8"/>
							<line x1="21" y1="21" x2="16.65" y2="16.65"/>
						</svg>
						<input
							type="text"
							placeholder="Rechercher une marchandise"
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
					<select
						className="widget-select"
						value={filter}
						onChange={e => setFilter(e.target.value as ItemFilter)}
					>
						<option value="all">Tous</option>
						<option value="fuel">Carburant</option>
						<option value="product">Produit</option>
						<option value="electricity">Électricité</option>
					</select>
				</div>

				{/* Tableau */}
				<div className="widget-table-wrap">
					<table className="widget-table">
						<thead>
						<tr>
							<th>Produit</th>
							<th>Quantité</th>
							<th>Type</th>
							<th>Prix</th>
						</tr>
						</thead>
						<tbody>
						{filtered.map(m => (
							<tr key={m.id}>
								<td>{m.name}</td>
								<td>
									{isElectricityItem(m) ? "—" : `${m.stock}${m.itemType === "fuel" ? " L" : ""}`}
								</td>
								<td>{typeLabel(m.itemType)}</td>
								<td>
									{isElectricityItem(m)
										? <>
											<div>{m.normalPrice} €/kWh (normal)</div>
											<div>{m.fastPrice} €/kWh (rapide)</div>
										</>
										: <div>{m.price} {m.itemType === "fuel" ? "€/L" : "€"}</div>}
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>

			</div>
		</FetchWrapper>
	);
};