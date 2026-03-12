---
on:
  schedule:
    - cron: daily
  workflow_dispatch:

permissions:
  contents: read
  issues: read

tools:
  github:
    toolsets: [issues]

safe-outputs:
  create-issue:
    title-prefix: "[daily-digest] "
    labels: [daily-digest, ai-summary]
    close-older-issues: true
    expires: 7d
---

# Daily GitHub News Digest

Read the file `public/data/feeds.json` from this repository.

Analyze today's articles (published within the last 24 hours).

## Output Format

Create a GitHub issue with the following structure:

### Title
`[daily-digest] GitHub Feed Digest — <today's date in Month Day, Year format>`

### Body

1. **🗞️ Executive Summary** — 2-3 sentences highlighting the most important themes across all articles today
2. **🚀 Key Announcements** — Notable releases, features, or changes (bullet list, max 5 items)
3. **📂 By Category** — Brief highlights grouped by category:
   - Platform
   - Engineering
   - Security
   - AI & Copilot
   - Open Source
   - Developer Tools
   - Community
   (skip categories with no articles today)
4. **📊 Stats** — Total articles today, top sources, trending topics
5. **🔗 Top Links** — Direct links to the 3-5 most important articles

## Guidelines

- Keep the tone concise and informative
- Use emoji for visual structure
- If no articles were published today, create a brief issue titled `[daily-digest] No new articles — <date>` with a short note
- Focus on what's actionable or noteworthy for developers
- Link article titles to their original URLs
