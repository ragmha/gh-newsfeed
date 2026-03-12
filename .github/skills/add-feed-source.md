# Skill: Add New Feed Source

## Description
Add a new RSS/Atom feed source to the GitHub Feed aggregator.

## Steps
1. Open `scripts/fetch-feeds.ts` and add a new entry to the `FEEDS` object:
   ```typescript
   "new-blog-id": {
     name: "Display Name",
     url: "https://example.com/feed.xml",
     category: "Category Name",  // Must match a key in CATEGORIES
   },
   ```
2. Open `src/lib/categories.ts` and add the `blogId` to the appropriate category array in `CATEGORIES`:
   ```typescript
   "Category Name": ["existing-blog", "new-blog-id"],
   ```
3. Open `src/lib/constants.ts` and add a color for the new blog in `BLOG_COLORS`:
   ```typescript
   "new-blog-id": "#hexcolor",
   ```
4. Test by running: `bunx tsx scripts/fetch-feeds.ts`
5. Verify the new feed appears in the UI: `bun run dev`

## Validation
- The blogId must be unique across all feeds
- The category must exist in `CATEGORIES` or be added as a new one
- The feed URL must return valid RSS 2.0 or Atom XML
- Run `bunx tsc --noEmit` to ensure no type errors
