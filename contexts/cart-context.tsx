"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProductBySlug, type Product } from "@/lib/products";

export type CartLine = { slug: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  items: { product: Product; quantity: number }[];
  subtotalCents: number;
  openCart: () => void;
  closeCart: () => void;
  cartOpen: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "smashwraps_cart_v1";

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setLines(loadLines());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug);
      if (i === -1) return [...prev, { slug, quantity: qty }];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + qty };
      return next;
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    if (qty < 1) {
      setLines((prev) => prev.filter((l) => l.slug !== slug));
      return;
    }
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug);
      if (i === -1) return [...prev, { slug, quantity: qty }];
      const next = [...prev];
      next[i] = { slug, quantity: qty };
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const items = useMemo(() => {
    const out: { product: Product; quantity: number }[] = [];
    for (const line of lines) {
      const product = getProductBySlug(line.slug);
      if (product) out.push({ product, quantity: line.quantity });
    }
    return out;
  }, [lines]);

  const subtotalCents = useMemo(
    () =>
      items.reduce(
        (sum, { product, quantity }) => sum + product.priceCents * quantity,
        0,
      ),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      add,
      setQty,
      remove,
      clear,
      items,
      subtotalCents,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      cartOpen,
    }),
    [lines, add, setQty, remove, clear, items, subtotalCents, cartOpen],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
