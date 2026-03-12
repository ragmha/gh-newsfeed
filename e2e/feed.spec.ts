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
    await expect(
      page.getByRole("heading", { name: "GitHub Feed", level: 1 }),
    ).toBeVisible();
  });

  test("articles render in a grid", async ({ page }) => {
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

    // Verify article count in the Controls bar
    await expect(page.getByText(/Showing\s+\d+\s+of\s+\d+\s+articles/)).toBeVisible();
  });

  test("search filters articles by title", async ({ page }) => {
    await loadPage(page);

    const searchInput = page.getByPlaceholder("Search articles…");
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

    // Click the "Security" category pill
    await page.getByRole("button", { name: /^Security/ }).click();

    // Security article should be visible
    await expect(
      page.getByText("New Security Advisory Database Expansion"),
    ).toBeVisible();
    // Articles from other categories should not
    await expect(
      page.getByText("GitHub Copilot Gets Smarter with GPT-5"),
    ).not.toBeVisible();
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

  test("bookmark toggle activates star", async ({ page }) => {
    await loadPage(page);

    // Find the first "Add bookmark" button
    const bookmarkBtn = page
      .getByRole("button", { name: "Add bookmark" })
      .first();
    await bookmarkBtn.click();

    // After clicking, the button label changes to "Remove bookmark"
    // and the star SVG gets the fill class
    const starIcon = page
      .getByRole("button", { name: "Remove bookmark" })
      .first()
      .locator("svg");
    await expect(starIcon).toHaveClass(/fill-yellow-400/);
  });

  test("sort by oldest first changes article order", async ({ page }) => {
    await loadPage(page);

    // Articles default to "Newest First" — first article is "GitHub Copilot Gets Smarter"
    const allLinks = page.locator("a[target='_blank']");
    const firstTitle = await allLinks.first().textContent();
    expect(firstTitle).toContain("GitHub Copilot Gets Smarter");

    // Open the sort select (the one showing "Newest First")
    await page.getByRole("combobox").filter({ hasText: "Newest" }).click();
    await page.getByRole("option", { name: "Oldest First" }).click();

    // Wait for re-render
    await page.waitForTimeout(200);

    // Now the oldest article should be first
    const firstTitleAfter = await allLinks.first().textContent();
    expect(firstTitleAfter).toContain("GitHub Universe 2024 Recap");
  });

  test("date filter narrows results", async ({ page }) => {
    await loadPage(page);

    // Start with all 6 articles
    await expect(page.getByText("Showing")).toContainText("6");

    // Open date select (showing "All Time") and pick "This Week"
    await page.getByRole("combobox").filter({ hasText: "All Time" }).click();
    await page.getByRole("option", { name: "This Week" }).click();

    // Wait for re-render
    await page.waitForTimeout(200);

    // "This Week" should show only articles from the last 7 days
    // (today, yesterday, 3 days ago, 5 days ago = 4 articles)
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

    const searchInput = page.getByPlaceholder("Search articles…");
    await searchInput.fill("xyznonexistent123");

    // Wait for debounce
    await page.waitForTimeout(400);

    await expect(page.getByText("No articles found")).toBeVisible();
    await expect(
      page.getByText("Try adjusting your filters or search query"),
    ).toBeVisible();
  });

  test("responsive: mobile viewport shows single column", async ({
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

    // The grid should use grid-cols-1 at mobile width.
    // Verify that article cards stack vertically by checking the grid container.
    const gridContainer = page.locator(
      ".grid.grid-cols-1",
    ).first();
    await expect(gridContainer).toBeVisible();

    // Verify the computed grid-template-columns is a single column
    const columns = await gridContainer.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns,
    );
    // Single column: should be one value (e.g., "343px"), not multiple
    const columnCount = columns.split(" ").length;
    expect(columnCount).toBe(1);

    await context.close();
  });
});
