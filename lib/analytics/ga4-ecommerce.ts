import type { Product } from "@/lib/products";

/** GA4 recommended item shape (subset we use) */
export type Ga4Item = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

export function productToGa4Item(product: Product, quantity: number): Ga4Item {
  return {
    item_id: product.slug,
    item_name: product.name,
    price: product.priceCents / 100,
    quantity,
  };
}

export function cartToGa4Items(
  items: { product: Product; quantity: number }[],
): Ga4Item[] {
  return items.map(({ product, quantity }) =>
    productToGa4Item(product, quantity),
  );
}
