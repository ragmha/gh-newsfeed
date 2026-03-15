"use client";

import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BLOG_TAG_COLORS } from "@/lib/constants";
import { Star, ExternalLink, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

function timeAgo(published: string): string {
  const now = Date.now();
  const then = new Date(published).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(published).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDate(published: string): string {
  return new Date(published).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

interface ArticleCardProps {
  article: Article;
  index: number;
  bookmarked: boolean;
  onToggleBookmark: (link: string) => void;
}

export function ArticleCard({ article, index, bookmarked, onToggleBookmark }: ArticleCardProps) {
  const ago = timeAgo(article.published);
  const date = formatDate(article.published);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark(article.link);
    toast(bookmarked ? "Bookmark removed" : "Bookmark added", {
      description: article.title,
      duration: 2000,
    });
  }

  return (
    <div className={cn(
      "group vercel-transition",
      "sm:border-b sm:border-border sm:hover:bg-secondary/60",
      index % 2 !== 0 && "sm:bg-card/30",
    )}>
      {/* Desktop: single row layout */}
      <div className="hidden sm:flex items-center gap-0 mono text-sm">
        <div className="flex-1 min-w-0 py-3 pl-3 pr-3">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 min-w-0"
          >
            <span className="font-medium text-foreground truncate vercel-transition group-hover/link:text-terminal-green">
              {article.title}
            </span>
            <ExternalLink className="size-3 shrink-0 text-muted-foreground/40 opacity-0 group-hover/link:opacity-100 vercel-transition" />
          </a>
        </div>

        <span className={cn(
          "w-32 shrink-0 truncate text-xs py-3 hidden lg:block",
          BLOG_TAG_COLORS[article.blogId] || "text-muted-foreground",
        )}>
          {article.blog}
        </span>

        <span className="w-20 shrink-0 tabular-nums text-muted-foreground py-3 text-right" title={date}>
          {ago}
        </span>

        <div className="w-10 shrink-0 flex justify-center py-3">
          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            className="text-muted-foreground vercel-transition hover:text-terminal-yellow"
          >
            <Star className={cn("size-4", bookmarked && "fill-terminal-yellow text-terminal-yellow")} />
          </button>
        </div>
      </div>

      {/* Mobile: Threads-style card */}
      <div className="sm:hidden px-4 py-4">
        {/* Header: source name + time */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-bold text-foreground">
            {article.blog}
          </span>
          <span className="text-sm text-muted-foreground tabular-nums shrink-0 ml-3" title={date}>{ago}</span>
        </div>

        {/* Body: title + summary as flowing text */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <p className="text-[15px] text-foreground leading-relaxed">
            {article.title}
          </p>
          {article.summary && (
            <p className="mt-1.5 text-[15px] text-muted-foreground leading-relaxed line-clamp-3">
              {article.summary}
            </p>
          )}
        </a>

        {/* Action row — spaced like Threads */}
        <div className="flex items-center gap-6 mt-3 pt-1">
          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            className="text-muted-foreground vercel-transition hover:text-terminal-yellow active:scale-90"
          >
            <Star className={cn("size-5", bookmarked && "fill-terminal-yellow text-terminal-yellow")} />
          </button>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground vercel-transition hover:text-foreground active:scale-90"
            aria-label="Open article"
          >
            <ArrowUpRight className="size-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
