"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutCancelRemind() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/email/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(typeof data.message === "string" ? data.message : "Could not send.");
        return;
      }
      setStatus("ok");
      setMsg(
        typeof data.message === "string" && data.message.length > 0
          ? data.message
          : "Check your inbox for a link back to the shop.",
      );
      setEmail("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  if (status === "ok") {
    return (
      <p className="text-sm text-zinc-400" role="status">
        {msg}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 text-left">
      <p className="text-center font-display text-xs tracking-[0.25em] text-zinc-500">
        Want a nudge later?
      </p>
      <p className="mt-2 text-center text-xs text-zinc-600">
        One email with a link to shop — no spam.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-smash-yellow sm:max-w-xs"
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "…" : "Email me"}
        </Button>
      </div>
      {msg && status === "err" ? (
        <p className="mt-2 text-center text-xs text-red-400">{msg}</p>
      ) : null}
    </form>
  );
}
