"use client";

import { decodeCartRecovery } from "@/lib/cart-recovery";
import { useCart } from "@/contexts/cart-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Applies `?cart=` recovery payload once, then strips the query (shareable email links).
 */
export function CartRecoveryHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { importRecovery } = useCart();
  const applied = useRef(false);

  useEffect(() => {
    const token = searchParams.get("cart");
    if (!token || applied.current) return;
    const lines = decodeCartRecovery(token);
    if (!lines?.length) return;
    applied.current = true;
    importRecovery(lines);
    router.replace(pathname, { scroll: false });
  }, [searchParams, pathname, router, importRecovery]);

  return null;
}
