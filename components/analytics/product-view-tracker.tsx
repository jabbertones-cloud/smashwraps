"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";
import { productToGa4Item } from "@/lib/analytics/ga4-ecommerce";
import { trackViewItem } from "@/lib/analytics/gtag-client";

export function ProductViewTracker({ product }: { product: Product }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackViewItem(productToGa4Item(product, 1));
  }, [product]);

  return null;
}
