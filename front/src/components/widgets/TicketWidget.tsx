import {useState, type FC} from "react";

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

const mockCart: CartItem[] = [
    {id: "1", name: "Jeton aspirateur", quantity: 1, unitPrice: 5.00},
    {id: "2", name: "Coca-Cola 33cL", quantity: 2, unitPrice: 5.00},
    {id: "3", name: "Stylo bille BIC", quantity: 1, unitPrice: 1.57},
];

export const TicketWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>(mockCart);

    const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    const updateQuantity = (id: string, delta: number) => {
        // Supprime l'article si la quantité atteint zéro
        setCart(prev => prev.map(item =>
            item.id === id ? {...item, quantity: item.quantity + delta} : item
        ).filter(item => item.quantity > 0));
    };

    return (
        <div className="widget-container">
            <div className="widget-toolbar">
                <div className="widget-search">
                    <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher un produit, ID"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="ticket-total-row">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
            </div>

            <div className="ticket-items-list">
                {cart.map(item => (
                    <div key={item.id} className="ticket-item">
                        <span className="ticket-item-name">{item.name}</span>
                        <div className="ticket-quantity-controls">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                        <span className="ticket-item-price">{(item.quantity * item.unitPrice).toFixed(2)} €</span>
                    </div>
                ))}
            </div>

            <div className="ticket-actions">
                <button className="ticket-action-btn" type="button" onClick={() => setCart([])}>Annuler</button>
                <button className="ticket-action-btn" type="button">Valider</button>
            </div>
        </div>
    );
};