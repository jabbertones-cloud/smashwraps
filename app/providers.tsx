"use client";

import { Analytics } from "@vercel/analytics/react";
import { CartProvider } from "@/contexts/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Analytics />
    </CartProvider>
  );
}
