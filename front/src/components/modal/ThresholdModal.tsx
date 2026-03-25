import {type FC} from "react";
import {useModal} from "../../context/ModalContext.tsx";
import {type ItemType} from "../../types.ts";

interface ThresholdModalProps {
    onConfirm: (threshold: Threshold[]) => void;
}

interface Threshold {
    id: number;
    itemName: string;
    threshold?: number;
    quantity?: number;
    itemType: ItemType;
}

const mockThreshold: Threshold[] = [
    {id: 1, itemName: "Sans plomb 95", threshold: 500, quantity: 600, itemType: "fuel"},
    {id: 2, itemName: "Sans plomb 98", itemType: "fuel"},
    {id: 3, itemName: "Arbres magiques", threshold: 50, quantity: 50, itemType: "product"},
    {id: 4, itemName: "Lave glace", threshold: 60, quantity: 50, itemType: "product"},
];

export const ThresholdModal: FC<ThresholdModalProps> = ({onConfirm}) => {
    const {closeModal} = useModal();

    return (
        <div className="modal-content">
            <h2>Seuils</h2>
            {Object.entries({"product": "Produits", "fuel": "Carburants"}).map(([itemType, label]) => (
                <div className="dropdown-menu">
                    <span>
                        {label}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                            <path d="M480-360 280-560h400L480-360Z"/>
                        </svg>
                    </span>
                    {mockThreshold.map(threshold => threshold.itemType === itemType && (
                        <div className="threshold-item">
                            <span>{threshold.itemName}</span>
                            {threshold.quantity !== undefined && threshold.threshold !== undefined
                                ? (<>
                                    <div>
                                        <div>
                                            <label htmlFor="">Seuil</label>
                                            <input type="number"/>
                                            {threshold.itemType === "fuel" && <span>L</span>}
                                        </div>

                                        <div>
                                            <label htmlFor="">Quantité</label>
                                            <input type="number"/>
                                            {threshold.itemType === "fuel" && <span>L</span>}
                                        </div>
                                    </div>
                                    <button className="action-btn">Supprimer</button>
                                </>) : (<>
                                    <span>Aucun seuil</span>
                                    <button className="action-btn">Ajouter</button>
                                </>)
                            }
                        </div>
                    ))}
                </div>
            ))}
            <div className="modal-actions">
                <button className="modal-button modal-button--cancel" onClick={closeModal}>
                    Annuler
                </button>
                <button
                    className="modal-button modal-button--confirm"
                    onClick={() => {
                        onConfirm(mockThreshold);
                        closeModal();
                    }}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
};