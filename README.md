# � GitHub Feed

Daily-updated GitHub blog aggregator hosted on GitHub Pages. Collects articles from 12+ GitHub RSS feeds and presents them in a clean, searchable interface.

## Features

- 📰 **12+ blog sources** — GitHub Blog, Changelog, Engineering, Security, AI & Copilot, VS Code, and more
- 🔍 **Search & filter** — by keyword, category, blog, or date range
- ⭐ **Bookmarks** — save articles for later (stored locally)
- 🌙 **Dark mode** — system-aware with manual toggle
- 📱 **Responsive** — mobile, tablet, and desktop
- 🤖 **AI daily digest** — agentic workflow creates summary issues
- 🧪 **Playwright E2E tests** — 10 tests run on every deploy

## Quick Start

```bash
bun install
bunx tsx scripts/fetch-feeds.ts   # Fetch RSS feeds
bun run dev                       # Start dev server
```

## Deploy

1. **Settings → Pages → Source** → select **GitHub Actions**
2. **Actions → Fetch Feeds & Deploy → Run workflow**

Site auto-updates daily at 12 PM UTC.

## Tech Stack

Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Playwright · GitHub Pages

## License

MIT
