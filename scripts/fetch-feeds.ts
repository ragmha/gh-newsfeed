import RSSParser from "rss-parser";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeedSource {
  name: string;
  url: string;
  category: string;
}

interface Article {
  title: string;
  link: string;
  published: string;
  summary: string;
  blog: string;
  blogId: string;
  category: string;
  author: string;
}

interface FeedOutput {
  lastUpdated: string;
  totalArticles: number;
  articles: Article[];
}

// ---------------------------------------------------------------------------
// Feed sources
// ---------------------------------------------------------------------------

const FEEDS: Record<string, FeedSource> = {
  // Platform
  "github-blog": {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    category: "Platform",
  },
  "github-changelog": {
    name: "GitHub Changelog",
    url: "https://github.blog/changelog/feed/",
    category: "Platform",
  },
  // Engineering
  "github-engineering": {
    name: "GitHub Engineering",
    url: "https://github.blog/engineering/feed/",
    category: "Engineering",
  },
  // Security
  "github-security": {
    name: "GitHub Security",
    url: "https://github.blog/security/feed/",
    category: "Security",
  },
  // AI & Copilot
  "github-ai": {
    name: "AI & ML / Copilot",
    url: "https://github.blog/ai-and-ml/feed/",
    category: "AI & Copilot",
  },
  // Open Source
  "github-opensource": {
    name: "Open Source",
    url: "https://github.blog/open-source/feed/",
    category: "Open Source",
  },
  // Community
  "github-community": {
    name: "News & Insights",
    url: "https://github.blog/news-insights/feed/",
    category: "Community",
  },
  "github-education": {
    name: "Developer Skills",
    url: "https://github.blog/developer-skills/feed/",
    category: "Community",
  },
  // Developer Tools
  "vscode-blog": {
    name: "VS Code Blog",
    url: "https://code.visualstudio.com/feed.xml",
    category: "Developer Tools",
  },
  "github-cli": {
    name: "GitHub CLI Releases",
    url: "https://github.com/cli/cli/releases.atom",
    category: "Developer Tools",
  },
  "github-desktop": {
    name: "GitHub Desktop Releases",
    url: "https://github.com/desktop/desktop/releases.atom",
    category: "Developer Tools",
  },
  // Microsoft
  "ms-devblogs": {
    name: "Microsoft DevBlogs",
    url: "https://devblogs.microsoft.com/feed/",
    category: "Microsoft",
  },
  "ms-learn": {
    name: "Microsoft Learn",
    url: "https://learn.microsoft.com/api/search/rss?search=*&locale=en-us&$top=100",
    category: "Microsoft",
  },
  // Videos
  "github-youtube": {
    name: "GitHub YouTube",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC7c3Kb6jYCRj4JOHHZTxKsQ",
    category: "Videos",
  },
  "vscode-youtube": {
    name: "VS Code YouTube",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCs5Y5_7XK8HLDX0SLNwkd3w",
    category: "Videos",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip HTML tags and decode common entities. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate text to `max` characters at a word boundary, appending "…". */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

/** Escape XML special characters for the RSS output. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Sleep for `ms` milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Fetch & parse
// ---------------------------------------------------------------------------

async function fetchAllFeeds(): Promise<Article[]> {
  const parser = new RSSParser();
  const articles: Article[] = [];
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const entries = Object.entries(FEEDS);

  for (let i = 0; i < entries.length; i++) {
    const [blogId, source] = entries[i];
    console.log(
      `[${i + 1}/${entries.length}] Fetching ${source.name} (${source.url})`
    );

    try {
      const feed = await parser.parseURL(source.url);
      let added = 0;

      for (const item of feed.items) {
        const pubDate = item.pubDate ?? item.isoDate;
        if (!pubDate) continue;

        const published = new Date(pubDate);
        if (published.getTime() < thirtyDaysAgo) continue;

        const rawSummary =
          item.contentSnippet ?? item.content ?? item.summary ?? "";
        const cleanSummary = truncate(stripHtml(rawSummary), 300);

        articles.push({
          title: (item.title ?? "Untitled").trim(),
          link: (item.link ?? "").trim(),
          published: published.toISOString(),
          summary: cleanSummary,
          blog: source.name,
          blogId,
          category: source.category,
          author: (item.creator ?? item.author ?? "").trim(),
        });
        added++;
      }

      console.log(`   ✓ ${added} articles within last 30 days`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`   ✗ Failed to fetch ${source.name}: ${message}`);
    }

    // Be polite — wait between requests
    if (i < entries.length - 1) {
      await sleep(500);
    }
  }

  return articles;
}

// ---------------------------------------------------------------------------
// Deduplicate
// ---------------------------------------------------------------------------

function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.link.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// RSS/XML generation
// ---------------------------------------------------------------------------

function generateRssXml(articles: Article[]): string {
  const top50 = articles.slice(0, 50);
  const now = new Date().toUTCString();

  const items = top50
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(a.link)}</link>
      <description>${escapeXml(a.summary)}</description>
      <pubDate>${new Date(a.published).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
      <source url="${escapeXml(a.link)}">${escapeXml(a.blog)}</source>
      <guid isPermaLink="true">${escapeXml(a.link)}</guid>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GitHub Newsfeed</title>
    <link>https://github.com</link>
    <description>Aggregated news from GitHub blogs, changelogs, and related developer tools.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://gh-newsfeed.vercel.app/data/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("🚀 Starting feed fetch…\n");

  const raw = await fetchAllFeeds();
  console.log(`\n📦 Fetched ${raw.length} total articles`);

  const unique = deduplicateArticles(raw);
  console.log(`🔍 ${unique.length} unique articles after deduplication`);

  // Sort newest-first
  unique.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );

  const output: FeedOutput = {
    lastUpdated: new Date().toISOString(),
    totalArticles: unique.length,
    articles: unique,
  };

  // Ensure output directory exists
  const dataDir = join(process.cwd(), "public", "data");
  mkdirSync(dataDir, { recursive: true });

  const jsonPath = join(dataDir, "feeds.json");
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`✅ Wrote ${jsonPath}`);

  const xmlPath = join(dataDir, "feed.xml");
  writeFileSync(xmlPath, generateRssXml(unique));
  console.log(`✅ Wrote ${xmlPath}`);

  console.log("\n🎉 Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
