import React, { createContext, useContext, useMemo, useState } from "react";
import { Food } from "../src/typescript";

type CartItem = Food & { qty: number };

type CartCtx = {
  items: CartItem[];
  addItem: (f: Food) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (f: Food) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === f.id);
      if (i !== -1) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { ...f, qty: 1 }];
    });
  };
  const increment = (id: number) =>
    setItems(prev => prev.map(it => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
  const decrement = (id: number) =>
    setItems(prev =>
      prev.flatMap(it => (it.id === id ? (it.qty > 1 ? [{ ...it, qty: it.qty - 1 }] : []) : [it]))
    );
  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((a, b) => a + b.qty, 0);
  const subtotal = items.reduce((a, b) => a + b.qty * b.price, 0);

  const value = useMemo(
    () => ({ items, addItem, increment, decrement, removeItem, clear, count, subtotal }),
    [items, count, subtotal]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
