import type { FlavorId, Product } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";

const flavorMeta: Record<
  FlavorId,
  { accent: string; border: string; title: string }
> = {
  "iced-watermelon": {
    accent: "text-pink-400",
    border: "border-pink-500/20 hover:border-pink-400/40 hover:shadow-pink-500/10",
    title: "ICED WATERMELON",
  },
  "passion-fruit": {
    accent: "text-purple-400",
    border: "border-purple-500/20 hover:border-purple-400/40 hover:shadow-purple-500/10",
    title: "PASSION FRUIT",
  },
  pineapple: {
    accent: "text-lime-300",
    border: "border-lime-400/20 hover:border-lime-400/40 hover:shadow-lime-400/10",
    title: "PINEAPPLE",
  },
  vanilla: {
    accent: "text-amber-200",
    border: "border-amber-700/25 hover:border-amber-500/40 hover:shadow-amber-500/10",
    title: "VANILLA",
  },
};

export type FlavorGroup = {
  flavorId: FlavorId;
  label: string;
  products: [Product, Product];
  meta: (typeof flavorMeta)[FlavorId];
};

export function getFlavorGroups(): FlavorGroup[] {
  const byFlavor = new Map<FlavorId, Product[]>();
  for (const p of PRODUCTS) {
    const list = byFlavor.get(p.flavorId) ?? [];
    list.push(p);
    byFlavor.set(p.flavorId, list);
  }
  const out: FlavorGroup[] = [];
  for (const [flavorId, products] of byFlavor) {
    const sorted = [...products].sort((a, b) => a.grams.localeCompare(b.grams));
    if (sorted.length !== 2) continue;
    out.push({
      flavorId,
      label: flavorMeta[flavorId].title,
      products: [sorted[0], sorted[1]],
      meta: flavorMeta[flavorId],
    });
  }
  const order: FlavorId[] = [
    "iced-watermelon",
    "passion-fruit",
    "pineapple",
    "vanilla",
  ];
  return order
    .map((id) => out.find((g) => g.flavorId === id))
    .filter(Boolean) as FlavorGroup[];
}
