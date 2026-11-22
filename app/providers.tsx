"use client";

import { Suspense } from "react";
import { CartRecoveryHandler } from "@/components/cart-recovery-handler";
import { CartProvider } from "@/contexts/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <CartRecoveryHandler />
      </Suspense>
      {children}
    </CartProvider>
  );
}
