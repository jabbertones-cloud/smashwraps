"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/products";
import { productToGa4Item } from "@/lib/analytics/ga4-ecommerce";
import { trackAddToCart } from "@/lib/analytics/gtag-client";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const onAdd = useCallback(() => {
    const product = getProductBySlug(slug);
    if (product) {
      trackAddToCart([productToGa4Item(product, 1)], product.priceCents);
    }
    add(slug, 1);
    setJustAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setJustAdded(false), 1600);
  }, [add, slug]);

  return (
    <Button
      type="button"
      className={cn("min-w-[200px]", className)}
      onClick={onAdd}
      aria-live="polite"
    >
      {justAdded ? "Added ✓" : "Add to cart"}
    </Button>
  );
}
