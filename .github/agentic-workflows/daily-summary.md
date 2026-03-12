---
on:
  schedule:
    - cron: "0 13 * * *"
  workflow_dispatch:
permissions:
  contents: read
  issues: read
safe-outputs:
  create-issue:
    title-prefix: "[daily-digest] "
    labels: [daily-digest, ai-summary]
    close-older-issues: true
    expires: 7d
---
## Daily GitHub News Digest

Read the file `public/data/feeds.json` from this repository.
Analyze today's articles (published within the last 24 hours).

Create a GitHub issue with:
1. **Executive Summary** — 2-3 sentences highlighting the most important themes
2. **Key Announcements** — Notable releases, features, or changes
3. **By Category** — Brief highlights grouped by category (Platform, Engineering, Security, AI & Copilot, etc.)
4. **Trending Topics** — Common themes across multiple articles

Keep the tone concise and informative. Use emoji for visual structure.
If no articles were published today, create a brief "No new articles today" issue.
