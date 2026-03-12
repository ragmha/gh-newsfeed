"use client";

import { useEffect, useRef } from "react";
import { useFeed } from "@/context/FeedProvider";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Search, Star, Sun, Moon, Rss, TrendingUp } from "lucide-react";

export function Header() {
  const {
    filteredArticles,
    articles,
    searchQuery,
    setSearchQuery,
    showBookmarksOnly,
    setShowBookmarksOnly,
  } = useFeed();
  const { theme, toggleTheme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    function isInputFocused() {
      const tag = document.activeElement?.tagName;
      return tag === "INPUT" || tag === "TEXTAREA";
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 gap-2 sm:gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-terminal-red" />
            <div className="size-2.5 rounded-full bg-terminal-yellow" />
            <div className="size-2.5 rounded-full bg-terminal-green" />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-0 mono text-xs uppercase tracking-wider">
          <a
            href="https://github.blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-3 text-muted-foreground hover:text-foreground vercel-transition"
          >
            GitHub Blog
          </a>
          <span className="px-2 sm:px-3 py-3 text-foreground border-b-2 border-terminal-green font-medium">
            Feed
          </span>
          <a
            href="https://github.blog/changelog/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-3 text-muted-foreground hover:text-foreground vercel-transition"
          >
            Changelog
          </a>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search articles ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mono h-8 w-52 rounded border border-border bg-background pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-terminal-green vercel-transition"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 mono text-xs text-muted-foreground">
            /
          </kbd>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-1.5 mono text-xs">
          <TrendingUp className="size-4 terminal-green" />
          <span className="text-muted-foreground">
            <span className="terminal-green">{filteredArticles.length}</span>
            <span className="text-muted-foreground/50">/{articles.length}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            aria-label="Toggle bookmarks"
            className={`size-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary ${
              showBookmarksOnly ? "text-terminal-yellow bg-secondary" : ""
            }`}
          >
            <Star className={`size-4 ${showBookmarksOnly ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <a
            href="/data/feed.xml"
            aria-label="RSS Feed"
            className="inline-flex items-center justify-center size-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary vercel-transition"
          >
            <Rss className="size-4" />
          </a>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search articles ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mono h-10 w-full rounded border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-terminal-green vercel-transition"
          />
        </div>
      </div>
    </header>
  );
}
