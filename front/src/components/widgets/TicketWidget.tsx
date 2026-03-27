import { type FC, type SubmitEvent, useEffect, useState } from "react";
import { apiUrl, fetchJsonWithAuth } from "../../api/common.ts";
import { TicketActions } from "../TicketActions";
import type { TicketStatus } from "../../types.ts";

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

export interface PaymentResponseDTO {
  paymentId: number;
  status: "VALIDATED" | "PARTIAL" | "CANCELED" | "EXCESS";
  amountRemaining: number;
  message: string;
}

const emptyCart: CartItem[] = [];

export const TicketWidget: FC = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>(emptyCart);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("initial");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<number | null>(null);
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponseDTO | null>(null);
  const [remainingAmount, setRemainingAmount] = useState(0.00);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  useEffect(() => {
    fetchJsonWithAuth(apiUrl("/products"))
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
      fetchJsonWithAuth(apiUrl(`/products/available-names?search=${encodeURIComponent(search)}`))
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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Disparaît après 5 secondes
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + delta } : item
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
            ? { ...item, quantity: item.quantity + 1 }
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

  const cancelTicket = async () => {
    if (currentTransactionId !== null) {
      try {
        await fetchJsonWithAuth(apiUrl(`/transactions/shop/cancel/${currentTransactionId}`), {
          method: "POST"
        });
      } catch (error) {
        console.error("Erreur réseau lors de l'annulation:", error);
      }
    }
    setCart([]);
    setNotification(null);
    setRemainingAmount(0.00);
    setTicketStatus("initial");
    setCurrentTransactionId(null);
  };

  const validateTicket = async () => {
    if (ticketStatus !== "initial" || cart.length === 0) {
      return;
    }

    try {
      const items = cart.map(item => ({
        idItem: Number(item.id),
        quantity: item.quantity
      }));

      const payload = { type: "products", isFromAutomat: false, lines: items };

      const data = await fetchJsonWithAuth(apiUrl("/transactions/shop"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      setCurrentTransactionId(data);
      setRemainingAmount(total);
      setTicketStatus("paymentSelection");
    } catch (error) {
      console.error("Erreur réseau lors de l'envoi du ticket:", error);
    }
  };

  const processCardPayment = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const endCardNumber: string = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const amount = formData.get("amount");


      const payload = { transactionId: currentTransactionId, paymentMethod: "CreditCard", amount: amount, endNumCard: endCardNumber };

      const data = await fetchJsonWithAuth(apiUrl("/payments/process"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      setPaymentResponse(data);
      setCurrentPaymentId(data.paymentId);
      setTicketStatus("processingCard");
    }
    catch (error) {
      setTicketStatus("paymentSelection");
      console.error("Erreur réseau lors du paiement en carte:", error);
    }
  }

  const processCashPayment = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const amount = formData.get("amount");

      const payload = { transactionId: currentTransactionId, paymentMethod: "Cash", amount: amount };

      const data = await fetchJsonWithAuth(apiUrl("/payments/process"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      setPaymentResponse(data);
      setCurrentPaymentId(data.paymentId);
      setTicketStatus("processingCash");
    }
    catch (error) {
      setTicketStatus("paymentSelection");
      console.error("Erreur réseau lors du paiement en espèces:", error);
    }
  }

  const paymentProcessed = async (explicitResponse?: PaymentResponseDTO) => {
    const isEvent = explicitResponse && 'nativeEvent' in (explicitResponse as object);
    const responseToUse = (explicitResponse && !isEvent) ? (explicitResponse as PaymentResponseDTO) : paymentResponse;

    if (!responseToUse) {
      console.error("Erreur : aucune donnée à traiter.");
      return;
    }

    console.log("Données traitées :", responseToUse);

    const newAmount = Number(responseToUse.amountRemaining ?? 0);
    setRemainingAmount(newAmount);

    const status = responseToUse.status;

    if (status === "VALIDATED") {
      setTicketStatus("validated");
      setNotification({ message: responseToUse.message, type: "success" });
      setCart([]);
    } else if (status === "PARTIAL") {
      setTicketStatus("paymentSelection");
      setNotification({ message: responseToUse.message, type: "warning" });
      setPaymentResponse(null);
    } else if (status === "CANCELED") {
      setTicketStatus("paymentSelection");
      setNotification({ message: responseToUse.message, type: "error" });
      setPaymentResponse(null);
    } else if (status === "EXCESS") {
      setTicketStatus("paymentSelection");
      setNotification({ message: responseToUse.message, type: "error" });
    }
  }

  const cancelPayment = async () => {
    if (currentPaymentId !== null) {
      try {
        const data = await fetchJsonWithAuth(apiUrl(`/payments/cancel/${currentPaymentId}`), {
          method: "POST"
        });
        setNotification({ message: "Paiement annulé.", type: "info" });
        setPaymentResponse(data);
        paymentProcessed(data);
      } catch (error) {
        setNotification({ message: "Erreur lors de l'annulation.", type: "error" });
        console.error("Erreur réseau lors de l'annulation:", error);
      }
    }
  }
  return (
    <div className="widget-container">
      <div className="widget-toolbar widget-toolbar-relative">
        <div className="widget-search">
          <svg className="widget-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
            disabled={ticketStatus !== "initial"} // Désactive la recherche si le ticket est en cours de validation/paiement
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

      <div className="ticket-remaining-row">
        <span>Reste à payer</span>
        <span>{(remainingAmount ?? 0).toFixed(2)} €</span>
      </div>

      <div className="ticket-items-list">
        {cart.map(item => (
          <div key={item.id} className="ticket-item">
            <span className="ticket-item-name">{item.name}</span>
            <div className="ticket-quantity-controls">
              <button type="button" onClick={() => updateQuantity(item.id, -1)} disabled={ticketStatus !== "initial"}>-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => updateQuantity(item.id, 1)} disabled={ticketStatus !== "initial"}>+</button>
            </div>
            <span className="ticket-item-price">{(item.quantity * item.unitPrice).toFixed(2)} €</span>
          </div>
        ))}
      </div>

      {notification && (
        <div className={`ticket-notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <TicketActions
        ticketStatus={ticketStatus}
        onCancelTicket={cancelTicket}
        onCancelPayment={cancelPayment}
        onValidate={validateTicket}
        onPayByCard={processCardPayment}
        onPayByCash={processCashPayment}
        setTicketStatus={setTicketStatus}
        isValidateDisabled={cart.length === 0}
        onPaymentProcessed={paymentProcessed}
      />
    </div>
  );
};
