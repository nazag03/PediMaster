import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const LS_KEY = "pm_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      const { id, name, price, category, image_url } = product;
      return [...prev, { id, name, price: +price || 0, qty, category, image_url }];
    });
  };

  const increment = (id) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );

  const decrement = (id) =>
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((a, b) => a + b.price * b.qty, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    increment,
    decrement,
    removeItem,
    clear,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
