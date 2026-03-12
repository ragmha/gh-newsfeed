"use client";

import { useMemo } from "react";
import type { Article } from "@/lib/types";
import { useFeed } from "@/context/FeedProvider";
import { Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// ── Tag color palette for categories ──
const CATEGORY_COLORS: Record<string, string> = {
  Platform: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Engineering: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Security: "bg-red-500/20 text-red-400 border-red-500/30",
  "AI & Copilot": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Open Source": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Community: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Developer Tools": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Microsoft: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Videos: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};
const DEFAULT_CATEGORY_COLOR = "bg-gray-500/20 text-gray-400 border-gray-500/30";

// ── Tag color palette for blog sources ──
const BLOG_TAG_COLORS: Record<string, string> = {
  "github-blog": "text-blue-400",
  "github-changelog": "text-green-400",
  "github-engineering": "text-orange-400",
  "github-security": "text-red-400",
  "github-ai": "text-violet-400",
  "github-opensource": "text-teal-400",
  "github-community": "text-pink-400",
  "github-education": "text-amber-400",
  "vscode-blog": "text-cyan-400",
  "github-cli": "text-indigo-400",
  "github-desktop": "text-lime-400",
  "ms-devblogs": "text-sky-400",
  "ms-learn": "text-emerald-400",
  "github-youtube": "text-rose-400",
  "vscode-youtube": "text-fuchsia-400",
};

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
    return new URL(url).hostname.replace(/^www\\./, "");
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

interface ArticleRowProps {
  article: Article;
  index: number;
}

export function ArticleRow({ article, index }: ArticleRowProps) {
  const { toggleBookmark, isBookmarked } = useFeed();
  const bookmarked = isBookmarked(article.link);
  const domain = useMemo(() => getDomain(article.link), [article.link]);
  const ago = useMemo(() => timeAgo(article.published), [article.published]);
  const date = useMemo(() => formatDate(article.published), [article.published]);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(article.link);
    toast(bookmarked ? "Bookmark removed" : "Bookmark added", {
      description: article.title,
      duration: 2000,
    });
  }

  const isEven = index % 2 === 0;

  return (
    <div className={`group flex items-center gap-0 mono text-sm border-b border-border vercel-transition hover:bg-secondary/60 ${
      isEven ? "bg-transparent" : "bg-card/30"
    }`}>
      {/* Index */}
      <span className="w-10 shrink-0 text-center tabular-nums text-muted-foreground py-3">
        {index + 1}
      </span>

      {/* Category tag */}
      <span className="w-28 shrink-0 py-3 px-0.5">
        <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium truncate max-w-full ${
          CATEGORY_COLORS[article.category] || DEFAULT_CATEGORY_COLOR
        }`}>
          {article.category || "General"}
        </span>
      </span>

      {/* Title + domain */}
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
          <span className="ml-2 text-xs text-muted-foreground/50 hidden sm:inline">
            {domain}
          </span>
        )}
      </div>

      {/* Blog source tag */}
      <span className={`w-32 shrink-0 truncate text-xs py-3 hidden lg:block ${
        BLOG_TAG_COLORS[article.blogId] || "text-muted-foreground"
      }`}>
        {article.blog}
      </span>

      {/* Author */}
      <span className="w-28 shrink-0 truncate text-xs text-muted-foreground py-3 hidden md:block">
        {article.author || "—"}
      </span>

      {/* Time */}
      <span className="w-16 shrink-0 text-right tabular-nums text-muted-foreground py-3">
        {ago}
      </span>

      {/* Date */}
      <span className="w-24 shrink-0 text-right tabular-nums text-muted-foreground py-3 hidden sm:block">
        {date}
      </span>

      {/* Bookmark */}
      <div className="w-10 shrink-0 flex justify-center py-3">
        <button
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          className="text-muted-foreground vercel-transition hover:text-terminal-yellow"
        >
          <Star className={`size-4 ${bookmarked ? "fill-terminal-yellow text-terminal-yellow" : ""}`} />
        </button>
      </div>
    </div>
  );
}
