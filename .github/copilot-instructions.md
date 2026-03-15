# GitHub Feed — Copilot Instructions

## Project Overview
A daily-updated GitHub blog aggregator hosted on GitHub Pages. Collects articles from 12+ GitHub-related RSS feeds and presents them in a searchable, filterable interface with AI-powered daily digests.

**Live site:** Deployed via GitHub Pages (static export)

## Tech Stack
- **Next.js 16** (App Router, Turbopack, React Compiler)
- **React 19.2**
- **TypeScript 5.x**
- **Tailwind CSS v4** — CSS-first config (`@theme` directive in `globals.css`, no `tailwind.config.js`)
- **shadcn/ui** (Radix + Nova preset) — Card, Badge, Button, Input, Select, Skeleton, Separator, ScrollArea, Sonner
- **rss-parser** — RSS/Atom feed fetching
- **tsx** — TypeScript script runner
- **GitHub Agentic Workflows** (`gh aw`) — AI-powered daily digest

## Architecture
```
src/
├── app/
│   ├── layout.tsx          # Root layout (Geist fonts, metadata, theme-color)
│   ├── page.tsx            # Home page — "use client", wires FeedProvider + all components
│   └── globals.css         # Tailwind v4 @theme + GitHub design tokens (oklch colors)
├── components/
│   ├── ui/                 # shadcn/ui primitives (do not edit directly)
│   ├── Header.tsx          # Gradient header, search, bookmarks, theme toggle
│   ├── FilterBar.tsx       # Two-tier: category pills → blog sub-pills
│   ├── Controls.tsx        # Showing count, date filter, sort select
│   ├── ArticlesGrid.tsx    # Date-grouped responsive grid
│   ├── ArticleCard.tsx     # Individual article card
│   ├── AISummary.tsx       # Fetches daily-digest issue from GitHub API
│   └── Footer.tsx          # RSS + repo links
├── context/
│   └── FeedProvider.tsx    # React context: articles, filtering, sorting, loading/error
├── hooks/
│   ├── useBookmarks.ts     # localStorage bookmarks (SSR-safe with isMounted)
│   ├── useTheme.ts         # Dark/light toggle (.dark class on <html>)
│   └── useDebounce.ts      # Generic debounce
└── lib/
    ├── types.ts            # Article, FeedData, SortOption, DateFilter
    ├── categories.ts       # CATEGORIES map
    └── constants.ts        # CATEGORY_COLORS, BLOG_TAG_COLORS, STORAGE_KEYS, FEED_DATA_PATH
    └── utils.ts            # cn() utility from shadcn

scripts/
└── fetch-feeds.ts          # RSS fetcher (12+ feeds → public/data/feeds.json + feed.xml)

.github/
├── agentic-workflows/
│   └── daily-summary.md    # gh-aw: AI daily digest → creates GitHub issue
└── workflows/
    ├── ci.yml              # Push/PR: lint, type-check, build, E2E tests
    └── deploy.yml          # Push to main + daily cron: fetch RSS → build → deploy to GH Pages
```

## Key Patterns

### Tailwind v4 (CSS-first)
- All theme tokens are in `src/app/globals.css` using `@theme inline { ... }`
- Custom colors: `--github-green`, `--github-blue`, `--github-purple`, `--github-orange`
- Dark mode via `.dark` class (not `prefers-color-scheme`)
- No `tailwind.config.js` — everything is CSS-based

### Component Guidelines
- All components are `"use client"` (static export, client-side rendering)
- Use shadcn/ui primitives from `@/components/ui/` — don't reinvent
- Use `lucide-react` for icons
- Use `useFeed()` from `@/context/FeedProvider` for all feed state
- Named exports for components, default export only for `page.tsx`

### Data Flow
1. `scripts/fetch-feeds.ts` fetches RSS → writes `public/data/feeds.json`
2. `FeedProvider` fetches `/data/feeds.json` on client mount
3. All filtering/sorting happens in `FeedProvider` — components just read `filteredArticles`
4. Bookmarks stored in localStorage (key: `ghfeed-bookmarks`)
5. Theme stored in localStorage (key: `ghfeed-theme`)

### Static Export (GitHub Pages)
- `next.config.ts` has `output: "export"` and `images: { unoptimized: true }`
- `public/.nojekyll` prevents Jekyll processing
- All assets must be in `public/` with relative paths
- No API routes, no server components with dynamic data
- No `next/image` optimization (unoptimized mode)

## Adding New Feed Sources
1. Add entry to `FEEDS` object in `scripts/fetch-feeds.ts`
2. Add blogId to appropriate category in `src/lib/categories.ts`
3. Add color mapping in `src/lib/constants.ts` → `BLOG_TAG_COLORS`

## Running Locally
```bash
bun install
bunx tsx scripts/fetch-feeds.ts   # Fetch RSS feeds
bun run dev                       # Start dev server
bun run build                     # Static export to out/
```

## Testing
```bash
bun run lint                      # ESLint
bunx tsc --noEmit                 # Type check
bunx playwright test              # E2E tests
```
