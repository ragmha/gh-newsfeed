import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBookmarks } from "@/hooks/useBookmarks";

describe("useBookmarks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty bookmarks", () => {
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks.size).toBe(0);
  });

  it("toggles a bookmark on", () => {
    const { result } = renderHook(() => useBookmarks());

    act(() => {
      result.current.toggleBookmark("https://example.com/article-1");
    });

    expect(result.current.isBookmarked("https://example.com/article-1")).toBe(true);
    expect(result.current.bookmarks.size).toBe(1);
  });

  it("toggles a bookmark off", () => {
    const { result } = renderHook(() => useBookmarks());

    act(() => {
      result.current.toggleBookmark("https://example.com/article-1");
    });
    act(() => {
      result.current.toggleBookmark("https://example.com/article-1");
    });

    expect(result.current.isBookmarked("https://example.com/article-1")).toBe(false);
    expect(result.current.bookmarks.size).toBe(0);
  });

  it("persists bookmarks to localStorage", () => {
    const { result } = renderHook(() => useBookmarks());

    act(() => {
      result.current.toggleBookmark("https://example.com/1");
      result.current.toggleBookmark("https://example.com/2");
    });

    const stored = JSON.parse(localStorage.getItem("ghfeed-bookmarks") || "[]");
    expect(stored).toContain("https://example.com/1");
    expect(stored).toContain("https://example.com/2");
  });

  it("reads existing bookmarks from localStorage", () => {
    localStorage.setItem(
      "ghfeed-bookmarks",
      JSON.stringify(["https://example.com/saved"]),
    );

    const { result } = renderHook(() => useBookmarks());
    expect(result.current.isBookmarked("https://example.com/saved")).toBe(true);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("ghfeed-bookmarks", "not-valid-json");

    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks.size).toBe(0);
  });
});
