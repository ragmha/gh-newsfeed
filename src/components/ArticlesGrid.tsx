"use client";

import { useCallback } from "react";
import { useFeed } from "@/context/FeedProvider";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Inbox } from "lucide-react";
import { ARTICLES_PER_PAGE } from "@/lib/constants";

// ---- skeleton loader -------------------------------------------------------

function SkeletonTable() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className={`flex items-center gap-0 border-b border-border py-2 px-2 ${i % 2 === 0 ? "" : "bg-card/30"}`}>
          <Skeleton className="w-8 h-3 rounded mr-2" />
          <Skeleton className="w-16 h-3 rounded mr-2" />
          <Skeleton className="flex-1 h-3 rounded mr-2" />
          <Skeleton className="w-12 h-3 rounded mr-2" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
      ))}
    </div>
  );
}

// ---- main component --------------------------------------------------------

export function ArticlesGrid() {
  const { filteredArticles, paginatedArticles, currentPage, loading, error, isBookmarked, toggleBookmark } = useFeed();

  const handleToggleBookmark = useCallback((link: string) => {
    toggleBookmark(link);
  }, [toggleBookmark]);

  if (loading) {
    return <SkeletonTable />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <AlertCircle className="size-8 text-terminal-red" />
        <p className="mono text-base text-foreground">Connection Error</p>
        <p className="mono text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <Inbox className="size-8 text-muted-foreground" />
        <p className="mono text-base text-foreground">No articles found</p>
        <p className="mono text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-border rounded overflow-hidden">
      {/* Table header (desktop only) */}
      <div className="hidden sm:flex items-center gap-0 mono text-xs uppercase tracking-wider text-muted-foreground bg-card border-b border-border">
        <span className="w-10 shrink-0 text-center py-2">#</span>
        <span className="w-28 shrink-0 py-2">Cat</span>
        <span className="flex-1 py-2">Article</span>
        <span className="w-32 shrink-0 py-2 hidden lg:block">Source</span>
        <span className="w-28 shrink-0 py-2 hidden md:block">Author</span>
        <span className="w-16 shrink-0 text-right py-2">Age</span>
        <span className="w-24 shrink-0 text-right py-2">Date</span>
        <span className="w-10 shrink-0" />
      </div>

      {/* Rows */}
      {paginatedArticles.map((article, i) => (
        <ArticleCard
          key={article.link}
          article={article}
          index={i + (currentPage - 1) * ARTICLES_PER_PAGE}
          bookmarked={isBookmarked(article.link)}
          onToggleBookmark={handleToggleBookmark}
        />
      ))}
    </div>
  );
}
