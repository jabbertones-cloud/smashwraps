"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { CartEmailReminder } from "@/components/cart-email-reminder";
import { cartToGa4Items } from "@/lib/analytics/ga4-ecommerce";
import { trackBeginCheckoutThenRedirect } from "@/lib/analytics/gtag-client";

export function CartDrawer() {
  const {
    items,
    subtotalCents,
    cartOpen,
    closeCart,
    setQty,
    remove,
    clear,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: items.map((i) => ({
            slug: i.product.slug,
            quantity: i.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }
      if (data.url) {
        trackBeginCheckoutThenRedirect(
          cartToGa4Items(items),
          subtotalCents,
          () => {
            window.location.href = data.url!;
          },
        );
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotalCents / 100);

  return (
    <Dialog.Root open={cartOpen} onOpenChange={(o) => !o && closeCart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#050505] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <Dialog.Title className="font-display text-xl tracking-wider text-white">
              YOUR CART
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-sm text-zinc-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <li
                    key={product.slug}
                    className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                      <AssetImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.priceCents / 100)}{" "}
                        each
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded border border-white/20 px-2 py-0.5 text-xs text-white hover:bg-white/10"
                          onClick={() =>
                            setQty(product.slug, quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="rounded border border-white/20 px-2 py-0.5 text-xs text-white hover:bg-white/10"
                          onClick={() =>
                            setQty(product.slug, quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-xs text-red-400 hover:underline"
                          onClick={() => remove(product.slug)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-white/10 p-6">
            <div className="mb-4 flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatted}</span>
            </div>
            <p className="mb-4 text-xs text-zinc-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mb-4">
              <CartEmailReminder />
            </div>
            {error && (
              <p className="mb-2 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <Button
              className="w-full"
              disabled={items.length === 0 || loading}
              onClick={checkout}
            >
              {loading ? "Opening checkout…" : "Checkout"}
            </Button>
            {items.length > 0 && (
              <button
                type="button"
                className="mt-3 w-full text-center text-xs text-zinc-500 hover:text-white"
                onClick={() => clear()}
              >
                Clear cart
              </button>
            )}
            <p className="mt-4 text-center text-[10px] text-zinc-600">
              <Link href="/legal/privacy" className="underline hover:text-zinc-400">
                Privacy
              </Link>
              {" · "}
              <Link href="/legal/terms" className="underline hover:text-zinc-400">
                Terms
              </Link>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
