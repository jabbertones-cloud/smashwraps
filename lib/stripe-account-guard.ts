/** Nonsecret merchant identity verified against the Smash Wraps Stripe catalog. */
export const SMASH_WRAPS_STRIPE_ACCOUNT_ID = "acct_1THIPiIokkmXI2SV";

export function isSmashWrapsAccountContextConfigured(configuredId: string | undefined): boolean {
  return configuredId?.trim() === SMASH_WRAPS_STRIPE_ACCOUNT_ID;
}

/** Never silently fall back to the platform account when Connect is unconfigured. */
export function requireSmashWrapsAccountContext(configuredId: string | undefined): string {
  if (!isSmashWrapsAccountContextConfigured(configuredId)) {
    throw new Error("smashwraps_stripe_account_context_missing_or_mismatched");
  }
  return SMASH_WRAPS_STRIPE_ACCOUNT_ID;
}
