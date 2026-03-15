import { test, expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Mock feed data with dynamic dates so date-filter tests are always reliable
// ---------------------------------------------------------------------------

function mockFeedData() {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10,
    0,
    0,
  );
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(today.getDate() - 5);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);
  const sixWeeksAgo = new Date(today);
  sixWeeksAgo.setDate(today.getDate() - 42);

  return {
    lastUpdated: now.toISOString(),
    totalArticles: 6,
    articles: [
      {
        title: "GitHub Copilot Gets Smarter with GPT-5",
        link: "https://github.blog/ai/copilot-gpt5",
        published: today.toISOString(),
        summary:
          "GitHub Copilot now leverages GPT-5 for more accurate code suggestions.",
        blog: "AI & Copilot",
        blogId: "github-ai",
        category: "AI & Copilot",
        author: "Sarah Chen",
      },
      {
        title: "New Security Advisory Database Expansion",
        link: "https://github.blog/security/advisory-db-expansion",
        published: yesterday.toISOString(),
        summary:
          "The GitHub Advisory Database now covers over 200,000 vulnerabilities.",
        blog: "GitHub Security",
        blogId: "github-security",
        category: "Security",
        author: "Marcus Rivera",
      },
      {
        title: "Actions Performance Improvements: 3x Faster Builds",
        link: "https://github.blog/engineering/actions-performance",
        published: threeDaysAgo.toISOString(),
        summary:
          "Optimized GitHub Actions runners deliver up to 3x faster build times.",
        blog: "GitHub Engineering",
        blogId: "github-engineering",
        category: "Engineering",
        author: "Priya Patel",
      },
      {
        title: "VS Code January Release Highlights",
        link: "https://code.visualstudio.com/updates/v1-96",
        published: fiveDaysAgo.toISOString(),
        summary:
          "The January release of Visual Studio Code brings sticky scroll improvements.",
        blog: "VS Code Blog",
        blogId: "vscode-blog",
        category: "Developer Tools",
        author: "João Moreno",
      },
      {
        title: "Open Source Friday: Celebrating Community Contributors",
        link: "https://github.blog/opensource/open-source-friday",
        published: twoWeeksAgo.toISOString(),
        summary:
          "Spotlighting outstanding community contributors making open source better.",
        blog: "GitHub Open Source",
        blogId: "github-opensource",
        category: "Open Source",
        author: "Lisa Park",
      },
      {
        title: "GitHub Universe 2024 Recap and Key Announcements",
        link: "https://github.blog/news/universe-2024-recap",
        published: sixWeeksAgo.toISOString(),
        summary:
          "A comprehensive recap of GitHub Universe 2024 covering major launches.",
        blog: "The GitHub Blog",
        blogId: "github-blog",
        category: "Platform",
        author: "Thomas Dohmke",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Intercept /data/feeds.json and return dynamic mock data. */
async function interceptFeed(page: Page) {
  await page.route("**/data/feeds.json", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockFeedData()),
    }),
  );
}

/** Block the external AI digest API call so it doesn't flake. */
async function blockDigestAPI(page: Page) {
  await page.route("**/api.github.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
}

async function loadPage(page: Page) {
  await interceptFeed(page);
  await blockDigestAPI(page);
  await page.goto("/");
  // Wait for articles to render (loading skeleton disappears)
  await expect(
    page.getByText("GitHub Copilot Gets Smarter with GPT-5"),
  ).toBeVisible();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("GitHub Feed", () => {
  test("page loads with title and header", async ({ page }) => {
    await loadPage(page);

    await expect(page).toHaveTitle("GitHub Feed");
    // Terminal header has nav with "Feed" active tab
    await expect(page.getByText("Feed").first()).toBeVisible();
  });

  test("articles render in terminal table", async ({ page }) => {
    await loadPage(page);

    // All 6 articles from mock data should be visible
    await expect(
      page.getByText("GitHub Copilot Gets Smarter with GPT-5"),
    ).toBeVisible();
    await expect(
      page.getByText("New Security Advisory Database Expansion"),
    ).toBeVisible();
    await expect(
      page.getByText("Actions Performance Improvements: 3x Faster Builds"),
    ).toBeVisible();
    await expect(
      page.getByText("VS Code January Release Highlights"),
    ).toBeVisible();
    await expect(
      page.getByText("Open Source Friday: Celebrating Community Contributors"),
    ).toBeVisible();
    await expect(
      page.getByText("GitHub Universe 2024 Recap and Key Announcements"),
    ).toBeVisible();

    // Verify table header column
    await expect(page.getByText("Article", { exact: true })).toBeVisible();
  });

  test("search filters articles by title", async ({ page }) => {
    await loadPage(page);

    const searchInput = page.getByPlaceholder("Search articles ...").first();
    await searchInput.fill("Security");

    // Wait for debounce (250ms) + render
    await page.waitForTimeout(400);

    await expect(
      page.getByText("New Security Advisory Database Expansion"),
    ).toBeVisible();
    // Other articles should be filtered out
    await expect(
      page.getByText("VS Code January Release Highlights"),
    ).not.toBeVisible();
  });

  test("category filter shows only matching articles", async ({ page }) => {
    await loadPage(page);

    // Click the "Security" category in filter bar
    await page.getByRole("button", { name: /^Security$/ }).click();

    // Security article should be visible
    await expect(
      page.getByText("New Security Advisory Database Expansion"),
    ).toBeVisible();
    // Articles from other categories should not
    await expect(
      page.getByText("VS Code January Release Highlights"),
    ).not.toBeVisible();
  });

  test("dark mode toggle adds .dark class to html", async ({ page }) => {
    await loadPage(page);

    const html = page.locator("html");

    // Initially no .dark class (default light theme)
    await expect(html).not.toHaveClass(/dark/);

    // Click theme toggle
    await page.getByRole("button", { name: "Toggle theme" }).click();

    // Now html should have .dark
    await expect(html).toHaveClass(/dark/);

    // Toggle back
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("bookmark toggle works via star button", async ({ page }) => {
    await loadPage(page);

    // Find the first "Add bookmark" button
    const bookmarkBtn = page
      .getByRole("button", { name: "Add bookmark" })
      .first();
    await bookmarkBtn.click();

    // After clicking, the aria-label changes to "Remove bookmark"
    await expect(
      page.getByRole("button", { name: "Remove bookmark" }).first(),
    ).toBeVisible();
  });

  test("date filter narrows results", async ({ page }) => {
    await loadPage(page);

    // Click "7d" tab (This Week)
    await page.getByRole("button", { name: /7d/ }).click();

    // Wait for re-render
    await page.waitForTimeout(200);

    // "This Week" should show only articles from the last 7 days
    await expect(
      page.getByText("GitHub Copilot Gets Smarter with GPT-5"),
    ).toBeVisible();

    // Articles from 2+ weeks ago should be hidden
    await expect(
      page.getByText("Open Source Friday: Celebrating Community Contributors"),
    ).not.toBeVisible();
    await expect(
      page.getByText("GitHub Universe 2024 Recap and Key Announcements"),
    ).not.toBeVisible();
  });

  test("no results state shows message", async ({ page }) => {
    await loadPage(page);

    const searchInput = page.getByPlaceholder("Search articles ...").first();
    await searchInput.fill("xyznonexistent123");

    // Wait for debounce
    await page.waitForTimeout(400);

    await expect(page.getByText("No articles found")).toBeVisible();
    await expect(
      page.getByText("Try adjusting your filters or search query"),
    ).toBeVisible();
  });

  test("responsive: mobile viewport shows articles", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();

    await interceptFeed(page);
    await blockDigestAPI(page);
    await page.goto("/");
    await expect(
      page.getByText("GitHub Copilot Gets Smarter with GPT-5"),
    ).toBeVisible();

    // Verify articles are rendered as rows
    const articleRows = page.locator("main a[target='_blank']");
    const count = await articleRows.count();
    expect(count).toBe(6);

    await context.close();
  });

  test("pagination navigates between pages", async ({ page }) => {
    // Generate 35 articles to trigger pagination (ARTICLES_PER_PAGE = 30)
    const now = new Date();
    const articles = Array.from({ length: 35 }, (_, i) => ({
      title: `Article ${String(i + 1).padStart(2, "0")}`,
      link: `https://example.com/article-${i + 1}`,
      published: new Date(now.getTime() - i * 3600_000).toISOString(),
      summary: `Summary for article ${i + 1}`,
      blog: "GitHub Blog",
      blogId: "github-blog",
      category: "Platform",
      author: "Test Author",
    }));

    await page.route("**/data/feeds.json", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          lastUpdated: now.toISOString(),
          totalArticles: articles.length,
          articles,
        }),
      }),
    );
    await blockDigestAPI(page);
    await page.goto("/");
    await expect(page.getByText("Article 01")).toBeVisible();

    // Should show pagination info "1–30 of 35"
    await expect(page.getByText(/1.30 of 35/)).toBeVisible();

    // Article 31 should NOT be on page 1
    await expect(page.getByText("Article 31")).not.toBeVisible();

    // Navigate to page 2
    await page.getByRole("button", { name: "Next page" }).click();

    // Now page 2 articles should be visible (31-35)
    await expect(page.getByText("Article 31")).toBeVisible();
    await expect(page.getByText(/31.35 of 35/)).toBeVisible();

    // Article 01 should NOT be on page 2
    await expect(page.getByText("Article 01")).not.toBeVisible();

    // Navigate back to page 1
    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(page.getByText("Article 01")).toBeVisible();

    // First/Last page buttons
    await page.getByRole("button", { name: "Last page" }).click();
    await expect(page.getByText("Article 31")).toBeVisible();

    await page.getByRole("button", { name: "First page" }).click();
    await expect(page.getByText("Article 01")).toBeVisible();
  });
});
