"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ slug }: { slug: string }) {
  const { add } = useCart();
  return (
    <Button type="button" className="min-w-[200px]" onClick={() => add(slug, 1)}>
      Add to cart
    </Button>
  );
}
