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

Create a GitHub issue with this exact structure:

### 1. Quick Summary
2-3 sentences highlighting the most important themes across today's articles.

### 2. Today's Reading List
A numbered list of every article from today, formatted as markdown links:
```
1. [Article Title](https://link-to-article)
2. [Article Title](https://link-to-article)
```

### 3. What Each Article Covers
For each article in the reading list, provide a 1-2 sentence description of what it covers. Use the article title as a bold markdown link:
```
**[Article Title](https://link-to-article)** — Brief description of the key points and why it matters.
```

### 4. Trending Topics
Common themes across multiple articles (2-3 bullet points max).

Keep the tone concise and informative. Use emoji for visual structure.
Make sure every article link uses full markdown link syntax: `[text](url)`.
If no articles were published today, create a brief "No new articles today" issue.
