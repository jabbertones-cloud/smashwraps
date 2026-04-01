# Deploy to GitHub + Vercel

Target remote: **[jabbertones-cloud/smashwraps](https://github.com/jabbertones-cloud/smashwraps)** (currently may be empty).

## SSH: use the Jabbertones host alias

This machine’s default `Host github.com` may point at another GitHub user’s key. **Use the Jabbertones key** via `~/.ssh/config`:

```sshconfig
Host github.com-jabbertones
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_jabbertones_github
  IdentitiesOnly yes
```

**Remote URL** (required for pushes to this org):

```bash
git remote set-url origin git@github.com-jabbertones:jabbertones-cloud/smashwraps.git
```

If you use plain `git@github.com:...`, GitHub may authenticate as a different user and push can fail with “verify your email” or permission errors.

## One-time: push this folder as the repo root

From **this directory** (`smashwraps-retail`):

```bash
git init
git branch -M main
git remote add origin git@github.com-jabbertones:jabbertones-cloud/smashwraps.git

git add .
git commit -m "feat: Smash Wraps Next.js storefront, MiroFish/TRIBE v2 audit pass, SEO/AEO/GEO"
git push -u origin main
```

If the remote was added as HTTPS, you can keep HTTPS and use `gh auth login`, or switch to SSH with the alias above:

```bash
git remote set-url origin git@github.com-jabbertones:jabbertones-cloud/smashwraps.git
```

If push fails with **“You must verify your email address”**, you are likely authenticating as the wrong GitHub user (wrong SSH key). Fix the remote URL to use `github.com-jabbertones` as above, or confirm your email at [github.com/settings/emails](https://github.com/settings/emails) for the account that owns the key in use.

If the remote already has a README commit:

```bash
git pull origin main --rebase
git push -u origin main
```

## Vercel

Repo includes **`vercel.json`** (Next.js build). Full checklist: **`docs/VERCEL-SETUP.md`** (GitHub app for `jabbertones-cloud`, import `smashwraps`, env vars, Stripe webhook, domain).

1. **Import** the GitHub repo in the [Vercel dashboard](https://vercel.com/new).
2. Root directory: **`.`** (repository root = Next app).
3. Environment variables: copy from `.env.example` and set production values (see `README.md`).
4. Production domain: set `NEXT_PUBLIC_SITE_URL` to the live URL.

Cursor (or any IDE) is **not** the deploy target: push to GitHub, Vercel builds from the repo.
