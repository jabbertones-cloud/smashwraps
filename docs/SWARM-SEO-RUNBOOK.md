# Swarm + SEO/AEO/GEO runbook (Smash Wraps)

Use **claw-architect** Mission Control so research and iterations stay consistent with the rest of the fleet.

## 1) Goal orchestrator (high level)

From the machine running the architect API:

```bash
curl -s -X POST http://127.0.0.1:4051/api/goal \
  -H "Content-Type: application/json" \
  -d '{"goal":"Re-audit smashwraps-retail for MiroFish + TRIBE v2: expand FAQ for AEO, verify JSON-LD, suggest internal links and llms.txt facts; no secrets in repo."}'
```

Adjust the goal text per sprint (GEO facts, GSC queries, competitor SERP).

## 2) Agent entry points

- **`config/mission-control-agents.json`** — each agent’s `primary_command` (e.g. research, copy, QA).
- **Docs:** `docs/AGENT-SYSTEM-AS-EXTENSION.md` (repo root).

## 3) Research → implement loop

1. Index / search symbols in `smashwraps-retail` (jCodeMunch) for `app/`, `components/`, `lib/`.
2. Run research agents for SERP/PAA if needed; merge findings into `docs/seo-research-brief.md`.
3. Ship copy/structured data changes in the Next app; redeploy Vercel from Git.

## 4) Vercel + GitHub

- **Repo:** [github.com/jabbertones-cloud/smashwraps](https://github.com/jabbertones-cloud/smashwraps) — push this app root (see `DEPLOY-GITHUB.md`).
- **Env:** Set `NEXT_PUBLIC_SITE_URL`, Stripe keys, `STRIPE_CONNECT_ACCOUNT_ID`, webhooks on the Vercel project linked to that repo.

Do **not** commit API keys or webhook secrets.
