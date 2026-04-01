"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trackGenerateLead } from "@/lib/analytics/gtag-client";

type Source = "footer" | "success" | "cancel" | "cart";

export function EmailCaptureForm({
  source,
  className = "",
  compact = false,
}: {
  source: Source;
  className?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(typeof data.message === "string" ? data.message : "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMsg(
        typeof data.message === "string" && data.message.length > 0
          ? data.message
          : "Thanks — check your inbox.",
      );
      trackGenerateLead({ source, method: "email" });
      setEmail("");
    } catch {
      setStatus("err");
      setMsg("Network error. Try again.");
    }
  }

  if (status === "ok") {
    return (
      <p className={`text-sm text-zinc-400 ${className}`} role="status">
        {msg}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div
        className={`flex flex-col gap-2 ${compact ? "sm:flex-row sm:items-stretch" : ""}`}
      >
        <label className="sr-only" htmlFor={`email-${source}`}>
          Email
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`min-h-[44px] min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-smash-yellow focus:ring-offset-2 focus:ring-offset-[#030303] ${compact ? "" : "w-full"}`}
        />
        <Button type="submit" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? "…" : "Subscribe"}
        </Button>
      </div>
      {msg && status === "err" ? (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {msg}
        </p>
      ) : null}
      <p className="mt-2 text-[10px] text-zinc-600">
        News, restocks, and offers. 21+ where required.{" "}
        <a href="/legal/privacy" className="underline hover:text-zinc-400">
          Privacy
        </a>
        .
      </p>
    </form>
  );
}
