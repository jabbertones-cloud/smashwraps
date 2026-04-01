"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/products";
import { productToGa4Item } from "@/lib/analytics/ga4-ecommerce";
import { trackAddToCart } from "@/lib/analytics/gtag-client";

export function AddToCartButton({ slug }: { slug: string }) {
  const { add } = useCart();
  return (
    <Button
      type="button"
      className="min-w-[200px]"
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
