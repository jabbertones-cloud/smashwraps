"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getProductBySlug,
  PRODUCT_SLUG_SET,
  type Product,
} from "@/lib/products";
import type { RecoveryLine } from "@/lib/cart-recovery";

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
  /** Replace cart from email recovery link (`?cart=`). */
  importRecovery: (lines: RecoveryLine[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "smashwraps_cart_v1";

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        line &&
        typeof line.slug === "string" &&
        PRODUCT_SLUG_SET.has(line.slug) &&
        typeof line.quantity === "number" &&
        line.quantity >= 1 &&
        line.quantity <= 99,
    );
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
    if (!PRODUCT_SLUG_SET.has(slug)) return;
    const q = Math.min(99, Math.max(1, Math.floor(qty)));
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug);
      if (i === -1) return [...prev, { slug, quantity: q }];
      const next = [...prev];
      next[i] = {
        ...next[i],
        quantity: Math.min(99, next[i].quantity + q),
      };
      return next;
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    if (!PRODUCT_SLUG_SET.has(slug)) return;
    if (qty < 1) {
      setLines((prev) => prev.filter((l) => l.slug !== slug));
      return;
    }
    const q = Math.min(99, Math.max(1, Math.floor(qty)));
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug);
      if (i === -1) return [...prev, { slug, quantity: q }];
      const next = [...prev];
      next[i] = { slug, quantity: q };
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const importRecovery = useCallback((incoming: RecoveryLine[]) => {
    const next = incoming
      .filter(
        (l) =>
          l &&
          typeof l.slug === "string" &&
          PRODUCT_SLUG_SET.has(l.slug) &&
          typeof l.quantity === "number",
      )
      .map((l) => ({
        slug: l.slug,
        quantity: Math.min(99, Math.max(1, Math.floor(l.quantity))),
      }));
    if (!next.length) return;
    setLines(next);
    setCartOpen(true);
  }, []);

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
      importRecovery,
    }),
    [lines, add, setQty, remove, clear, importRecovery, items, subtotalCents, cartOpen],
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
