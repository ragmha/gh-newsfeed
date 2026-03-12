# Skill: Deploy to GitHub Pages

## Description
Deploy the GitHub Feed static site to GitHub Pages.

## Manual Deploy
```bash
npx tsx scripts/fetch-feeds.ts    # Fetch latest feeds
npm run build                      # Build static export to out/
```

## Automated Deploy (GitHub Actions)
The `.github/workflows/fetch-feeds.yml` workflow:
1. Runs daily at 12 PM UTC (or manually)
2. Checks out repo → Node.js 22 → `npm ci`
3. Fetches RSS feeds → Builds Next.js → Deploys `out/` to Pages

## Setup Requirements
1. **Settings → Pages → Source** → select **GitHub Actions**
2. For custom domain: add `CNAME` file in `public/`

## Troubleshooting
- **Missing styles**: Ensure `public/.nojekyll` exists
- **Stale content**: Check Actions tab for latest run status
- **Build fails**: Run `npm run build` locally first
