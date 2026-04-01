# Smash Wraps retail — MiroFish + TRIBE v2 re-audit

**Framework:** [`config/mirofish-tribev2-portfolio-audit.json`](../../config/mirofish-tribev2-portfolio-audit.json) (website surface) · **Profile cues:** [`config/skynpatch-mirofish-tribev2-profiles.json`](../../config/skynpatch-mirofish-tribev2-profiles.json) (`website` + `wholesale_landing` where relevant)

**Targets (website):** `tribe_v2_alignment_score` ≥ 82 · `cognitive_load_risk` ≤ 35 · `interaction_latency_risk` ≤ 30 · `onboarding_ambiguity_risk` ≤ 32

**Expert panels modeled:** Conversion Copywriter · Growth PM · Accessibility Specialist

---

## Executive summary

| Signal | Before (estimate) | After (post-fix estimate) | Notes |
|--------|-------------------|---------------------------|--------|
| TRIBE v2 alignment | 74 | **84** | Clearer hero value prop, trust strip, FAQ/AEO expansion, `llms.txt` |
| Cognitive load risk | 38 | **30** | Shorter path to shop/price; “what’s in a pack” repeated at decision points |
| Interaction latency risk | 32 | **26** | Skip link, focus rings, cart remains one tap from header |
| Onboarding ambiguity risk | 34 | **28** | Checkout expectations stated (tax/shipping at pay); wholesale pointer in footer |

**MiroFish-style friction map (website):**

| Signal | Finding | Mitigation shipped |
|--------|---------|-------------------|
| Hero clarity | Headline was category-only (“RICE PAPER TUBES”) — weak brand + SEO | Brand + product in H1; lead line states problem/solution |
| Trust barriers | No visible payment/policy cues above fold | Trust strip (Stripe, policies, shipping clarity) |
| CTA friction | Single path ok; B2B cohort unclear | Footer line for wholesale / retail buyers |
| Mobile-first scan | Dense hero; prices only in grid | Price under each variant; trust strip scannable |
| Drop-off moments | How section “Gallery” tiles ambiguous | Labeled flavor grid + clearer explainer copy |

---

## Cohort case studies (target demographics)

### 1) `new_b2b_buyers` (trust in &lt; 2 min)

- **Need:** Entity trust, policy links, clear SKU structure for reorder conversations.
- **Audit:** Policies existed but weren’t echoed near commerce intent; About was thin.
- **Rating:** 6/10 → **8/10** after footer wholesale hint + trust strip + stronger About/FAQ.

### 2) `returning_buyers`

- **Need:** Fast re-buy, recognizable flavor × size matrix, price confidence.
- **Rating:** 7/10 → **8/10** (shop grid shows price + PDP links; consider “buy again” email later).

### 3) `mobile_first_users`

- **Need:** Thumb reach to cart, readable taps, no hover-only affordances.
- **Audit:** Cart in header ok; added focus-visible and skip link for keyboard/mobile screen reader users.
- **Rating:** 7/10 → **8/10**.

### 4) `accessibility_needs`

- **Need:** Focus order, skip navigation, meaningful headings, non-color-only cues.
- **Audit:** Improved H1 semantics; skip link; `:focus-visible` rings; decorative tiles have labels.
- **Rating:** 6/10 → **8/10** (axe pass recommended before launch).

---

## Expert panel notes

### Conversion Copywriter

- **Hero:** Lead with outcome (“Flavor in the tip, not on the paper”) + proof (“3 Chops · 110mm”).
- **Risk:** Superlatives without proof — kept factual; compliance still owns claims.

### Growth PM

- **Activation:** Primary CTA = Shop; secondary = How it works; cart always visible.
- **Next test:** A/B hero subhead length; add social proof block when reviews exist.

### Accessibility Specialist

- Skip link, `#main-content`, visible focus, FAQ as real Q&A for assistive tech.

---

## SEO / AEO / GEO

- **Technical:** `sitemap.xml`, `robots.txt`, per-route metadata, Product + FAQPage + Organization + WebSite JSON-LD.
- **AEO:** FAQ expanded with natural questions shoppers and assistants ask.
- **GEO:** `llms.txt` expanded with canonical product facts, policy paths, and “do not hallucinate” cues.

**Swarm / automation:** See [`SWARM-SEO-RUNBOOK.md`](./SWARM-SEO-RUNBOOK.md) in this folder (run from parent `claw-architect` via Mission Control `/api/goal` or agent commands).

---

## Email flows (Resend) — TRIBE + MiroFish pass (2026-04-01)

**Orchestrator:** Mission Control `/api/goal` was **unavailable** (no listener on `127.0.0.1:4051`); this pass was completed **inline** against the same framework targets (website surface).

| TRIBE cohort / signal | Email template | Mitigation |
|----------------------|----------------|----------------|
| `new_b2b_buyers` · trust_barriers | Welcome | Wholesale pointer → **About**; policies linked in footer shell. |
| `returning_buyers` · cognitive_load | Post-purchase | Short line recap + **Shop again**; order reference for support. |
| `mobile_first_users` · interaction_latency | Cart reminder | CTA copy assumes thumb-first (“Open site & restore cart”); recovery link. |
| `accessibility_needs` · onboarding_ambiguity | All | Plain sentences, one primary CTA, table for line items; footer links text-labeled (not color-only). |
| MiroFish · trust near pay | Cart / Post-purchase | States **Stripe** secure checkout / receipt; shipping & returns linked in thank-you. |
| Abandoned Checkout (server) | `checkout.session.expired` | Auto email when session dies with email on file + catalog line items; **Resend idempotency** per Stripe event. |
| Compliance | Welcome / Cancel nudge | **21+** in welcome; cancel email states **no charge**; no medical or unverified claims. |

**Files:** `lib/email/templates/transactional.ts`, `lib/email/templates/wrap.ts` (footer: Shipping · Returns · FAQ · Privacy).

---

## Re-measure checklist

1. Lighthouse (mobile) on `/`, `/shop`, sample PDP.
2. Rich results test (Google) on PDP + FAQ URLs.
3. Re-run portfolio script when Smash Wraps is added to the UX foundry manifest:  
   `config/mirofish-tribev2-portfolio-audit.json` + `reports/ux-foundry/`.

---

*Last updated: 2026-04-01 (email flows section added)*
