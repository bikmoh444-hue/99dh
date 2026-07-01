"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, Product } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  toast: string;
  addItem: (product: Product) => void;
  decrement: (productId: string) => void;
  increment: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setToast: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "99dh-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setLines(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const total = lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0);

    return {
      lines,
      count,
      total,
      toast,
      setToast,
      addItem(product) {
        setLines((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line));
          }
          return [...current, { product, quantity: 1 }];
        });
        setToast(`${product.name} ajouté au panier`);
      },
      decrement(productId) {
        setLines((current) =>
          current
            .map((line) => (line.product.id === productId ? { ...line, quantity: Math.max(0, line.quantity - 1) } : line))
            .filter((line) => line.quantity > 0)
        );
      },
      increment(productId) {
        setLines((current) => current.map((line) => (line.product.id === productId ? { ...line, quantity: line.quantity + 1 } : line)));
      },
      removeItem(productId) {
        setLines((current) => current.filter((line) => line.product.id !== productId));
      },
      clearCart() {
        setLines([]);
      }
    };
  }, [lines, toast]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast ? <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft">{toast}</div> : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
