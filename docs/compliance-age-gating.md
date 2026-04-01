# Compliance & age gating (template)

**Not legal advice.** Replace every section with counsel-approved content before launch.

## Product & claims

- [ ] Written memo on product classification (accessory vs tobacco-adjacent vs other).
- [ ] Marketing claims reviewed (including “non-tobacco” if used).

## Age & checkout

- [ ] Minimum age and attestation flow per memo (modal, checkbox, ID vendor, etc.).
- [ ] Shipping restrictions and signature requirements documented.

## Stripe

- [ ] Stripe Support ticket: confirm **business type**, **MCC**, and approval for exact SKUs.
- [ ] Statement descriptor and dispute playbook agreed.

## Stripe webhooks (production)

- [ ] Endpoint: `POST /api/webhooks/stripe` (use signing secret `STRIPE_WEBHOOK_SECRET`).
- [ ] Events: at minimum `checkout.session.completed`; monitor `payment_intent.payment_failed`, `charge.dispute.*`.
