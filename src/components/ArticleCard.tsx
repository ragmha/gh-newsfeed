"use client";

import { useMemo } from "react";
import type { Article } from "@/lib/types";
import { BLOG_COLORS, DEFAULT_BLOG_COLOR } from "@/lib/constants";
import { useFeed } from "@/context/FeedProvider";
import {
  Card,
  CardHeader,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, User, ExternalLink } from "lucide-react";
import { toast } from "sonner";

function isNew(published: string): boolean {
  const publishedDate = new Date(published);
  const now = new Date();
  return now.getTime() - publishedDate.getTime() < 24 * 60 * 60 * 1000;
}

function formatDate(published: string): string {
  return new Date(published).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: Article }) {
  const { toggleBookmark, isBookmarked } = useFeed();
  const bookmarked = isBookmarked(article.link);

  const blogColor =
    BLOG_COLORS[article.blogId] ?? DEFAULT_BLOG_COLOR;

  const articleIsNew = useMemo(() => isNew(article.published), [article.published]);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    toggleBookmark(article.link);
    toast(bookmarked ? "Bookmark removed" : "Bookmark added", {
      description: article.title,
      duration: 2000,
    });
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={`${blogColor.bg} ${blogColor.text} border-0`}
          >
            {article.blog}
          </Badge>
          {articleIsNew && (
            <Badge variant="destructive" className="animate-pulse">
              NEW
            </Badge>
          )}
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Star
              className={`size-4 ${
                bookmarked
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-start gap-1 font-semibold leading-snug hover:underline"
        >
          {article.title}
          <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
        </a>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {article.author && (
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {article.author}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(article.published)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.summary}
        </p>
      </CardContent>
    </Card>
  );
}
