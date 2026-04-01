"use client";

import { useEffect, useRef } from "react";
import { trackPurchase, type PurchasePayload } from "@/lib/analytics/gtag-client";

type Props = { sessionId: string | undefined };

const STORAGE_PREFIX = "ga4_purchase_fired_";

export function GaPurchaseTracker({ sessionId }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (!sessionId || fired.current) return;
    const key = STORAGE_PREFIX + sessionId;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/session-for-analytics?session_id=${encodeURIComponent(sessionId)}`,
          { method: "GET", cache: "no-store" },
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as PurchasePayload;
        if (!data.transaction_id || data.value == null) return;

        trackPurchase(data);
        fired.current = true;
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* ignore quota */
        }
      } catch {
        /* offline / aborted */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return null;
}
