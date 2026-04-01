"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";

/** Cart abandonment: email a recovery link that hydrates cart via `?cart=`. */
export function CartEmailReminder() {
  const { items } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  if (items.length === 0) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const lines = items.map((i) => ({
        slug: i.product.slug,
        quantity: i.quantity,
      }));
      const res = await fetch("/api/email/cart-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lines }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(typeof data.message === "string" ? data.message : "Could not send.");
        return;
      }
      setStatus("ok");
      setMsg(
        data.message && typeof data.message === "string"
          ? data.message
          : "Check your email for a link back to your cart.",
      );
      setEmail("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  if (status === "ok") {
    return (
      <p className="text-xs text-zinc-400" role="status">
        {msg}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        Email my cart
      </p>
      <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
        We will send one reminder with a link to restore these items.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-black/40 px-3 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-smash-yellow"
        />
        <Button type="submit" size="sm" disabled={status === "loading"} className="min-h-11 shrink-0 px-4 text-xs">
          {status === "loading" ? "…" : "Send"}
        </Button>
      </div>
      {msg && status === "err" ? (
        <p className="mt-2 text-[10px] text-red-400">{msg}</p>
      ) : null}
    </form>
  );
}
