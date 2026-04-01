"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const KEY = "smashwraps_age_attested_v1";

export function AgeGate({ suppress }: { suppress?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (suppress) return;
    try {
      if (typeof window === "undefined") return;
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [suppress]);

  function confirm() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (suppress || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 p-4 pb-8 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
        <h2 id="age-gate-title" className="font-display text-2xl tracking-wide text-white">
          Age &amp; eligibility
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          This site is intended for adults. You must meet the minimum age and eligibility
          rules for this product where you live. If you are not eligible, please leave
          this site.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          More detail:{" "}
          <Link href="/legal/compliance" className="text-smash-yellow underline">
            Compliance
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="flex-1" onClick={confirm}>
            I confirm I meet the requirements
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              window.location.href = "https://www.google.com";
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
