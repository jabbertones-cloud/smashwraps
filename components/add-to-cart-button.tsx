"use client";

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
  return (
    <Button
      type="button"
      className={cn("min-w-[200px]", className)}
      onClick={() => {
        const product = getProductBySlug(slug);
        if (product) {
          trackAddToCart([productToGa4Item(product, 1)], product.priceCents);
        }
        add(slug, 1);
      }}
    >
      Add to cart
    </Button>
  );
}
