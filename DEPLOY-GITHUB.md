# Deploy to GitHub + Vercel

Target remote: **[jabbertones-cloud/smashwraps](https://github.com/jabbertones-cloud/smashwraps)** (currently may be empty).

## One-time: push this folder as the repo root

From **this directory** (`smashwraps-retail`):

```bash
git init
git branch -M main
git remote add origin git@github.com:jabbertones-cloud/smashwraps.git
# or: https://github.com/jabbertones-cloud/smashwraps.git

git add .
git commit -m "feat: Smash Wraps Next.js storefront, MiroFish/TRIBE v2 audit pass, SEO/AEO/GEO"
git push -u origin main
```

If the remote already has a README commit:

```bash
git pull origin main --rebase
git push -u origin main
```

## Vercel

1. **Import** the GitHub repo in the [Vercel dashboard](https://vercel.com/new).
2. Root directory: **`.`** (repository root = Next app).
3. Environment variables: copy from `.env.example` and set production values (see `README.md`).
4. Production domain: set `NEXT_PUBLIC_SITE_URL` to the live URL.

This assistant **cannot** log into your Vercel or GitHub account; run the commands locally with your credentials.
