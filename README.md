# 🐙 GitHub Feed

A beautiful, auto-updating news aggregator that collects the latest posts from across the GitHub ecosystem. Built with Next.js and deployed to GitHub Pages via Actions — no server required.

## ✨ Features

- **12+ RSS sources** — GitHub Blog, Changelog, Engineering, Security, AI & Copilot, and more
- **Full-text search** — instantly filter articles by title, summary, blog, or author
- **Category & blog filters** — two-tier filtering with seven categories
- **Bookmarks** — save articles to read later (persisted in localStorage)
- **Dark mode** — system-aware with manual toggle
- **Responsive** — optimized for mobile, tablet, and desktop
- **Auto-updated daily** — GitHub Actions fetches fresh feeds every day at 12 PM UTC
- **AI daily digest** — automated summary posted as a GitHub Issue via agentic workflow
- **PWA** — installable as a progressive web app with offline support
- **RSS output** — subscribe via the generated `feed.xml`
- **Playwright E2E tests** — end-to-end tests run on every deploy
- **Static export** — zero runtime costs, pure HTML/CSS/JS on GitHub Pages

## 📰 Blog Sources

| Category | Source | Feed |
|----------|--------|------|
| **Platform** | GitHub Blog | `github.blog/feed/` |
| **Platform** | GitHub Changelog | `github.blog/changelog/feed/` |
| **Platform** | GitHub Product | `github.blog/category/product/feed/` |
| **Engineering** | GitHub Engineering | `github.blog/engineering/feed/` |
| **Security** | GitHub Security | `github.blog/category/security/feed/` |
| **AI & Copilot** | AI & ML / Copilot | `github.blog/category/ai-and-ml/feed/` |
| **Open Source** | Open Source | `github.blog/category/open-source/feed/` |
| **Community** | The ReadME Project | `github.blog/category/community/feed/` |
| **Community** | GitHub Education | `github.blog/category/education/feed/` |
| **Developer Tools** | VS Code Blog | `code.visualstudio.com/feed.xml` |
| **Developer Tools** | GitHub CLI Releases | `github.com/cli/cli/releases.atom` |
| **Developer Tools** | GitHub Desktop Releases | `github.com/desktop/desktop/releases.atom` |

## 🚀 Setup

1. **Create a repository** from this template (or fork it)
2. **Push to GitHub**
3. **Enable GitHub Pages**
   - Go to **Settings → Pages**
   - Set **Source** to **GitHub Actions**
4. **Trigger the first run**
   - Go to **Actions → Fetch Feeds & Deploy**
   - Click **Run workflow**

The workflow will fetch all RSS feeds, build the site, run tests, and deploy to GitHub Pages automatically. After the first run, it will repeat daily at 12:00 UTC.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Fetch RSS feeds (generates public/data/feeds.json and feed.xml)
npx tsx scripts/fetch-feeds.ts

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## ⚙️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Actions (daily cron @ 12:00 UTC)                    │
│                                                             │
│  1. fetch-feeds.ts → fetches 12 RSS/Atom feeds              │
│  2. Deduplicates & sorts articles (last 30 days)            │
│  3. Writes public/data/feeds.json + feed.xml                │
│  4. next build → static export to out/                      │
│  5. Playwright E2E tests verify the build                   │
│  6. Deploy out/ to GitHub Pages                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Browser (client-side)                                      │
│                                                             │
│  1. Loads static HTML/JS from GitHub Pages                  │
│  2. FeedProvider fetches /data/feeds.json                   │
│  3. React Context manages filters, search, sort, bookmarks  │
│  4. All filtering/search happens in-browser (no API calls)  │
│  5. Bookmarks & theme persisted in localStorage             │
└─────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- **Static export** (`output: "export"`) — no Node.js server needed at runtime
- **Client-side filtering** — all data ships as a JSON file; filtering is instant
- **React Context** — single provider for feed state, no external state library
- **shadcn/ui** — accessible, composable UI primitives built on Radix

## 🧪 Testing

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Run Playwright E2E tests
npx playwright install --with-deps chromium
npx playwright test

# View Playwright report
npx playwright show-report
```

The CI workflow runs all three checks (lint, type check, E2E tests) on every deploy. Playwright test reports are uploaded as artifacts on failure.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (static export) |
| UI | [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config, OKLch colors) |
| Icons | [Lucide React](https://lucide.dev) |
| RSS Parsing | [rss-parser](https://github.com/rbren/rss-parser) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Testing | [Playwright](https://playwright.dev) |
| Linting | [ESLint 9](https://eslint.org) + [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) |
| CI/CD | [GitHub Actions](https://github.com/features/actions) → [GitHub Pages](https://pages.github.com) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |

## 📄 License

[MIT](LICENSE)
