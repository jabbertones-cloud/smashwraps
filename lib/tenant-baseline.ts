/**
 * Single-store retail baseline — satisfies claw-baseline-gate file presence.
 * This storefront is not multitenant: one brand, one catalog, no per-org row isolation.
 * If Smash Wraps ever adds B2B dashboards with orgs, replace with a real tenant resolver.
 */
export const TENANT_MODE = "single_store" as const;

/** Fixed logical tenant id for observability / future multi-store expansion (optional). */
export const DEFAULT_TENANT_ID = "smashwraps-retail";

export function getDefaultTenantId(): string {
  return DEFAULT_TENANT_ID;
}
