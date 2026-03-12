# Skill: Write Playwright E2E Test

## Description
Write end-to-end tests for the GitHub Feed using Playwright.

## Template
```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for feed data to load
    await page.waitForSelector("[data-testid='articles-grid']", { timeout: 10000 });
  });

  test("should do something", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("GitHub Feed");
  });
});
```

## Guidelines
- Tests live in `e2e/` directory
- Run with: `npx playwright test`
- The app is a static export — tests run against a local server serving `out/`
- Feed data comes from `public/data/feeds.json` — ensure it exists before testing
- Use `data-testid` attributes for reliable selectors
- Test key flows: search, filter by category, toggle bookmarks, dark mode, sort
- Mock the GitHub API for AISummary tests (or accept it may be empty)

## Running Tests
```bash
npx playwright install            # Install browsers (first time)
npx playwright test               # Run all tests
npx playwright test --ui          # Run with UI
npx playwright test e2e/search.spec.ts  # Run specific file
```
