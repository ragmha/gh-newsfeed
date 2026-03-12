"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { Article, FeedData, SortOption, DateFilter } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { FEED_DATA_PATH } from "@/lib/constants";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useDebounce } from "@/hooks/useDebounce";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface FeedContextValue {
  // Data
  articles: Article[];
  filteredArticles: Article[];
  lastUpdated: string;
  feedSummary: string | undefined;

  // Filter state
  currentCategory: string | null;
  currentFilter: string | null; // blogId within category
  searchQuery: string;
  sortBy: SortOption;
  dateFilter: DateFilter;
  showBookmarksOnly: boolean;

  // Setters
  setCurrentCategory: (cat: string | null) => void;
  setCurrentFilter: (blogId: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: SortOption) => void;
  setDateFilter: (d: DateFilter) => void;
  setShowBookmarksOnly: (b: boolean) => void;

  // Bookmarks
  bookmarks: Set<string>;
  toggleBookmark: (link: string) => void;
  isBookmarked: (link: string) => boolean;

  // Status
  loading: boolean;
  error: string | null;
}

const FeedContext = createContext<FeedContextValue | null>(null);

// ---------------------------------------------------------------------------
// Helper: date‑range filter
// ---------------------------------------------------------------------------

function isWithinDateRange(published: string, filter: DateFilter): boolean {
  if (filter === "all") return true;

  const date = new Date(published);
  const now = new Date();

  switch (filter) {
    case "today": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return date >= start;
    }
    case "week": {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return date >= start;
    }
    case "month": {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      return date >= start;
    }
    default:
      return true;
  }
}

// ---------------------------------------------------------------------------
// Helper: sort comparator
// ---------------------------------------------------------------------------

function sortArticles(articles: Article[], sortBy: SortOption): Article[] {
  const sorted = [...articles];
  switch (sortBy) {
    case "date-desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.published).getTime() - new Date(a.published).getTime(),
      );
    case "date-asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.published).getTime() - new Date(b.published).getTime(),
      );
    case "blog":
      return sorted.sort((a, b) => a.blog.localeCompare(b.blog));
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// Provider component
// ---------------------------------------------------------------------------

export function FeedProvider({ children }: { children: ReactNode }) {
  // Raw data
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [feedSummary, setFeedSummary] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter / sort state
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 250);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  // Reset blog‑level filter when category changes
  const handleSetCategory = useCallback((cat: string | null) => {
    setCurrentCategory(cat);
    setCurrentFilter(null);
  }, []);

  // Fetch feed data
  useEffect(() => {
    let cancelled = false;

    async function fetchFeed() {
      try {
        const res = await fetch(FEED_DATA_PATH);
        if (!res.ok) throw new Error(`Failed to load feed (${res.status})`);
        const data: FeedData = await res.json();

        if (cancelled) return;

        setArticles(data.articles);
        setLastUpdated(data.lastUpdated);
        setFeedSummary(data.summary);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load feed data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFeed();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived filtered + sorted list
  const filteredArticles = useMemo(() => {
    let result = articles;

    // 1. Category filter — narrow to blog IDs in that category
    if (currentCategory && CATEGORIES[currentCategory]) {
      const blogIds = CATEGORIES[currentCategory];
      result = result.filter((a) => blogIds.includes(a.blogId));
    }

    // 2. Blog‑level filter within category
    if (currentFilter) {
      result = result.filter((a) => a.blogId === currentFilter);
    }

    // 3. Search (title, summary, blog name, author)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.blog.toLowerCase().includes(q) ||
          (a.author && a.author.toLowerCase().includes(q)),
      );
    }

    // 4. Date range
    result = result.filter((a) => isWithinDateRange(a.published, dateFilter));

    // 5. Bookmarks only
    if (showBookmarksOnly) {
      result = result.filter((a) => bookmarks.has(a.link));
    }

    // 6. Sort
    return sortArticles(result, sortBy);
  }, [
    articles,
    currentCategory,
    currentFilter,
    debouncedSearch,
    dateFilter,
    showBookmarksOnly,
    bookmarks,
    sortBy,
  ]);

  const value: FeedContextValue = useMemo(
    () => ({
      articles,
      filteredArticles,
      lastUpdated,
      feedSummary,

      currentCategory,
      currentFilter,
      searchQuery,
      sortBy,
      dateFilter,
      showBookmarksOnly,

      setCurrentCategory: handleSetCategory,
      setCurrentFilter,
      setSearchQuery,
      setSortBy,
      setDateFilter,
      setShowBookmarksOnly,

      bookmarks,
      toggleBookmark,
      isBookmarked,

      loading,
      error,
    }),
    [
      articles,
      filteredArticles,
      lastUpdated,
      feedSummary,
      currentCategory,
      currentFilter,
      searchQuery,
      sortBy,
      dateFilter,
      showBookmarksOnly,
      handleSetCategory,
      bookmarks,
      toggleBookmark,
      isBookmarked,
      loading,
      error,
    ],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export { FeedContext };

export function useFeed(): FeedContextValue {
  const ctx = useContext(FeedContext);
  if (!ctx) {
    throw new Error("useFeed must be used within a <FeedProvider>");
  }
  return ctx;
}
