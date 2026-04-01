"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";
import { productToGa4Item } from "@/lib/analytics/ga4-ecommerce";
import { trackViewItemList } from "@/lib/analytics/gtag-client";

export function ShopItemListTracker({ products }: { products: Product[] }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || products.length === 0) return;
    sent.current = true;
    trackViewItemList(
      products.map((p) => productToGa4Item(p, 1)),
      "Shop — all flavors",
    );
  }, [products]);

  return null;
}
