import Link from "next/link";
import { Lock, Package, Shield } from "lucide-react";

/**
 * MiroFish / TRIBE: reduce trust_barriers near primary commerce paths.
 */
export function TrustStrip() {
  return (
    <ul className="mt-8 flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
      <li className="flex items-center gap-2">
        <Lock className="h-4 w-4 shrink-0 text-smash-yellow" aria-hidden />
        <span>Secure checkout</span>
      </li>
      <li className="flex items-center gap-2">
        <Package className="h-4 w-4 shrink-0 text-smash-yellow" aria-hidden />
        <span>Shipping &amp; tax shown before you pay</span>
      </li>
      <li className="flex items-center gap-2">
        <Shield className="h-4 w-4 shrink-0 text-smash-yellow" aria-hidden />
        <span>
          <Link href="/legal/shipping" className="underline hover:text-zinc-300">
            Shipping
          </Link>
          {" · "}
          <Link href="/legal/returns" className="underline hover:text-zinc-300">
            Returns
          </Link>
          {" · "}
          <Link href="/legal/privacy" className="underline hover:text-zinc-300">
            Privacy
          </Link>
        </span>
      </li>
    </ul>
  );
}
