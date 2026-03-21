import {useState, useEffect, type FC} from "react";
import {apiUrl} from "../../config/api";

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
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

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

    return (
        <div className="widget-container">
            <div className="widget-toolbar" style={{ position: 'relative', overflow: 'visible' }}>
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
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    />
                    {showResults && search && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            marginTop: '8px',
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            zIndex: 1000,
                            maxHeight: '250px',
                            overflowY: 'auto'
                        }}>
                            {isSearching ? (
                                <div style={{ padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>Recherche...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(name => (
                                    <div
                                        key={name}
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f1f5f9',
                                            fontSize: '14px',
                                            color: '#334155'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        onClick={() => addProductToCart(name)}
                                    >
                                        {name}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>Aucun produit trouvé</div>
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
