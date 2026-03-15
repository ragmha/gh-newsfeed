import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isWithinDateRange, sortArticles } from "@/context/FeedProvider";
import type { Article } from "@/lib/types";

// ---------------------------------------------------------------------------
// isWithinDateRange
// ---------------------------------------------------------------------------

describe("isWithinDateRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for "all" filter regardless of date', () => {
    expect(isWithinDateRange("2020-01-01T00:00:00Z", "all")).toBe(true);
  });

  it('"today" includes articles from today', () => {
    expect(isWithinDateRange("2026-03-15T08:00:00Z", "today")).toBe(true);
  });

  it('"today" excludes articles from yesterday', () => {
    // Use a time that's definitely yesterday in any timezone
    expect(isWithinDateRange("2026-03-13T12:00:00Z", "today")).toBe(false);
  });

  it('"week" includes articles from 3 days ago', () => {
    expect(isWithinDateRange("2026-03-12T12:00:00Z", "week")).toBe(true);
  });

  it('"week" excludes articles from 10 days ago', () => {
    expect(isWithinDateRange("2026-03-05T12:00:00Z", "week")).toBe(false);
  });

  it('"month" includes articles from 2 weeks ago', () => {
    expect(isWithinDateRange("2026-03-01T12:00:00Z", "month")).toBe(true);
  });

  it('"month" excludes articles from 2 months ago', () => {
    expect(isWithinDateRange("2026-01-10T12:00:00Z", "month")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// sortArticles
// ---------------------------------------------------------------------------

function makeArticle(overrides: Partial<Article>): Article {
  return {
    title: "Test",
    link: "https://example.com",
    published: "2026-03-15T12:00:00Z",
    summary: "",
    blog: "Test Blog",
    blogId: "test",
    category: "Test",
    author: "",
    ...overrides,
  };
}

describe("sortArticles", () => {
  const articles: Article[] = [
    makeArticle({ title: "B", published: "2026-03-10T00:00:00Z", blog: "Zeta" }),
    makeArticle({ title: "A", published: "2026-03-15T00:00:00Z", blog: "Alpha" }),
    makeArticle({ title: "C", published: "2026-03-12T00:00:00Z", blog: "Mu" }),
  ];

  it("sorts by date descending (newest first)", () => {
    const sorted = sortArticles(articles, "date-desc");
    expect(sorted.map((a) => a.title)).toEqual(["A", "C", "B"]);
  });

  it("sorts by date ascending (oldest first)", () => {
    const sorted = sortArticles(articles, "date-asc");
    expect(sorted.map((a) => a.title)).toEqual(["B", "C", "A"]);
  });

  it("sorts by blog name alphabetically", () => {
    const sorted = sortArticles(articles, "blog");
    expect(sorted.map((a) => a.blog)).toEqual(["Alpha", "Mu", "Zeta"]);
  });

  it("does not mutate the original array", () => {
    const original = [...articles];
    sortArticles(articles, "date-asc");
    expect(articles).toEqual(original);
  });
});
