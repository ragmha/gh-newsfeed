---
on:
  schedule:
    - cron: daily
  workflow_dispatch:

permissions:
  contents: read

tools:
  github:
    toolsets: [repos]

safe-outputs:
  create-pull-request:
    title-prefix: "[feed-update] "
    labels: [automated, feed-data]
---

# Daily Feed Fetcher

Fetch the latest articles from all configured RSS/Atom feeds and update the feed data file.

## Instructions

1. **Run the feed fetcher script** by executing `npx tsx scripts/fetch-feeds.ts` in the repository root. This script:
   - Reads RSS/Atom feeds from 12+ GitHub blog sources
   - Parses and normalizes article data
   - Writes the output to `public/data/feeds.json`
   - Also generates `public/data/feed.xml` (unified RSS feed)

2. **Check if the feed data has changed** by comparing the new `public/data/feeds.json` with the existing file. Look at the `lastUpdated` timestamp and `totalArticles` count.

3. **If new articles were found**, create a pull request with the updated `public/data/feeds.json` and `public/data/feed.xml`. The PR description should include:
   - Number of new articles found
   - List of new article titles (up to 10)
   - Sources that had new content

4. **If no new articles were found**, call the `noop` tool with a message explaining that no new articles were found. Do NOT create a PR with unchanged data.

## Feed Sources

The feed sources are defined in `scripts/fetch-feeds.ts`. They include:
- GitHub Blog (github.blog)
- GitHub Changelog
- GitHub Engineering
- GitHub Security
- GitHub AI & Copilot
- GitHub Open Source
- GitHub Community
- GitHub Education
- VS Code Blog
- GitHub CLI
- GitHub Desktop
- Microsoft Dev Blogs
- Microsoft Learn
- GitHub YouTube
- VS Code YouTube

## Important Notes

- Always run `npx tsx scripts/fetch-feeds.ts` to fetch feeds — do not manually edit `feeds.json`
- The script handles deduplication, date sorting, and summary truncation
- If the script fails (network errors, rate limits), report the error but do not create a PR with partial data
