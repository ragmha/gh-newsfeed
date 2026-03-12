"use client";

import { useEffect, useRef } from "react";
import { useFeed } from "@/context/FeedProvider";
import { useTheme } from "@/hooks/useTheme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Sun, Moon } from "lucide-react";

export function Header() {
  const {
    filteredArticles,
    searchQuery,
    setSearchQuery,
    showBookmarksOnly,
    setShowBookmarksOnly,
    lastUpdated,
  } = useFeed();
  const { theme, toggleTheme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: branding */}
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span className="text-3xl" role="img" aria-label="GitHub Octocat">
                🐙
              </span>
              GitHub Feed
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/70">
              Daily updates from GitHub blogs · Last 30 days
            </p>
          </div>

          {/* Right: search + actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="search"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-48 border-primary-foreground/20 bg-primary-foreground/10 pl-8 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:border-primary-foreground/40 focus-visible:ring-primary-foreground/20 sm:w-64"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-primary-foreground/20 bg-primary-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground/60 sm:inline-block">
                ⌘K
              </kbd>
            </div>

            <Button
              variant={showBookmarksOnly ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              aria-label="Toggle bookmarks"
              className={
                showBookmarksOnly
                  ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              }
            >
              <Star className={showBookmarksOnly ? "fill-current" : ""} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-primary-foreground/15 pt-3 text-xs text-primary-foreground/70">
          <span>Last updated: {formattedDate}</span>
          <span className="hidden sm:inline">·</span>
          <span>{filteredArticles.length} articles</span>
        </div>
      </div>
    </header>
  );
}
