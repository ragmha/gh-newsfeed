"use client";

import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR, BLOG_TAG_COLORS } from "@/lib/constants";
import { Star, ExternalLink } from "lucide-react";
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

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
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
  const domain = getDomain(article.link);
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
      "group border-b border-border vercel-transition hover:bg-secondary/60",
      index % 2 !== 0 && "bg-card/30",
    )}>
      {/* Desktop: single row layout */}
      <div className="hidden sm:flex items-center gap-0 mono text-sm">
        <span className="w-10 shrink-0 text-center tabular-nums text-muted-foreground py-3">
          {index + 1}
        </span>

        <span className="shrink-0 py-3 pl-0.5 w-28">
          <span className={cn(
            "inline-block rounded border px-2 py-0.5 text-xs font-medium truncate",
            CATEGORY_COLORS[article.category] || DEFAULT_CATEGORY_COLOR,
          )}>
            {article.category || "General"}
          </span>
        </span>

        <div className="flex-1 min-w-0 py-3 pr-3">
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
          {domain && (
            <span className="ml-2 text-xs text-muted-foreground/50">
              {domain}
            </span>
          )}
        </div>

        <span className={cn(
          "w-32 shrink-0 truncate text-xs py-3 hidden lg:block",
          BLOG_TAG_COLORS[article.blogId] || "text-muted-foreground",
        )}>
          {article.blog}
        </span>

        <span className="w-28 shrink-0 truncate text-xs text-muted-foreground py-3 hidden md:block">
          {article.author || "—"}
        </span>

        <span className="w-16 shrink-0 tabular-nums text-muted-foreground py-3 text-right">
          {ago}
        </span>

        <span className="w-24 shrink-0 text-right tabular-nums text-muted-foreground py-3">
          {date}
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

      {/* Mobile: stacked layout */}
      <div className="sm:hidden flex items-start gap-2 px-3 py-2.5 mono text-xs">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn(
              "inline-block rounded border px-1.5 py-0.5 text-xs font-medium shrink-0",
              CATEGORY_COLORS[article.category] || DEFAULT_CATEGORY_COLOR,
            )}>
              {article.category || "General"}
            </span>
            <span className="text-muted-foreground tabular-nums">{ago}</span>
          </div>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground leading-snug line-clamp-2 vercel-transition hover:text-terminal-green"
          >
            {article.title}
          </a>
        </div>
        <button
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          className="shrink-0 mt-1 text-muted-foreground vercel-transition hover:text-terminal-yellow"
        >
          <Star className={cn("size-4", bookmarked && "fill-terminal-yellow text-terminal-yellow")} />
        </button>
      </div>
    </div>
  );
}
