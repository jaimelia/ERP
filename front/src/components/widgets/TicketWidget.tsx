import {useState, useEffect, type FC} from "react";
import {apiUrl} from "../../api/common.ts";
import { TicketActions } from "../TicketActions";

interface Product {
    idItem: number;
    name: string;
    unitPrice: number;
    stock: number;
    alertThreshold: number;
}

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

const emptyCart: CartItem[] = [];

export const TicketWidget: FC = () => {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>(emptyCart);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [ticketStatus, setTicketStatus] = useState<number>(0);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [currentTransactionId, setCurrentTransactionId] = useState<number | null>(null);

    useEffect(() => {
        fetch(apiUrl("/products"))
            .then(res => res.json())
            .then(data => setAllProducts(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        let active = true;

        if (!search) {
            return;
        }

        const timer = setTimeout(() => {
            if (active) setIsSearching(true);
            fetch(apiUrl(`/products/available-names?search=${encodeURIComponent(search)}`))
                .then(res => res.json())
                .then(data => {
                    if (active) {
                        setSearchResults(data);
                        setIsSearching(false);
                    }
                })
                .catch(err => {
                    if (active) {
                        console.error(err);
                        setIsSearching(false);
                    }
                });
        }, 300); // debounce

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [search]);

    const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? {...item, quantity: item.quantity + delta} : item
        ).filter(item => item.quantity > 0));
    };

    const addProductToCart = (productName: string) => {
        const product = allProducts.find(p => p.name === productName);
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === String(product.idItem));
            if (existing) {
                return prev.map(item =>
                    item.id === String(product.idItem)
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            }
            return [...prev, {
                id: String(product.idItem),
                name: product.name,
                quantity: 1,
                unitPrice: product.unitPrice
            }];
        });
        setSearch("");
        setSearchResults([]);
        setShowResults(false);
    };

    const handleCancelTicket = async () => {
        if (currentTransactionId !== null) {
            try {
                await fetch(apiUrl(`/transactions/shop/cancel/${currentTransactionId}`), {
                    method: "POST"
                });
            } catch (error) {
                console.error("Erreur réseau lors de l'annulation:", error);
            }
        }
        setCart([]);
        setTicketStatus(0);
        setCurrentTransactionId(null);
    };

    const validateTicket = async () => {
        if (ticketStatus !== 0 || cart.length === 0) {
            return;
        }

        try {
            const items = cart.map(item => ({
                idItem: Number(item.id),
                quantity: item.quantity
            }));

            const payload = { type: "products", isFromAutomat: false, lines: items };

            const response = await fetch(apiUrl("/transactions/shop"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentTransactionId(data);
                setTicketStatus(1);
            } else {
                console.error("Erreur lors de la validation du ticket.");
            }
        } catch (error) {
            console.error("Erreur réseau lors de l'envoi du ticket:", error);
        }
    };

    return (
        <div className="widget-container">
            <div className="widget-toolbar widget-toolbar-relative">
                <div className="widget-search">
                    <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher un produit, ID"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setShowResults(!!e.target.value);
                        }}
                        onFocus={() => { if (search) setShowResults(true); }}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)} // Délai pour permettre le clic sur un résultat
                        disabled={ticketStatus !== 0} // Désactive la recherche si le ticket est en cours de validation/paiement
                    />
                    {showResults && search && (
                        <div className="search-results-dropdown">
                            {isSearching ? (
                                <div className="search-results-message">Recherche...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(name => (
                                    <div
                                        key={name}
                                        className="search-results-item"
                                        onClick={() => addProductToCart(name)}
                                    >
                                        {name}
                                    </div>
                                ))
                            ) : (
                                <div className="search-results-message">Aucun produit trouvé</div>
                            )}
                        </div>
                    )}
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
                            <button type="button" onClick={() => updateQuantity(item.id, -1)} disabled={ticketStatus !== 0}>-</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)} disabled={ticketStatus !== 0}>+</button>
                        </div>
                        <span className="ticket-item-price">{(item.quantity * item.unitPrice).toFixed(2)} €</span>
                    </div>
                ))}
            </div>

            <TicketActions
                ticketStatus={ticketStatus}
                onCancel={handleCancelTicket}
                onValidate={validateTicket}
                isValidateDisabled={cart.length === 0}
            />
        </div>
    );
};
