"use client";

import { useMemo } from "react";
import { useFeed } from "@/context/FeedProvider";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Inbox } from "lucide-react";
import type { Article } from "@/lib/types";

// ---- date grouping helpers ------------------------------------------------

function getDateGroupLabel(published: string): string {
  const date = new Date(published);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const pubDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (pubDay >= today) return "Today";
  if (pubDay >= yesterday) return "Yesterday";
  if (pubDay >= weekAgo) return "This Week";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function groupByDate(
  articles: Article[],
): { label: string; articles: Article[] }[] {
  const map = new Map<string, Article[]>();

  for (const article of articles) {
    const label = getDateGroupLabel(article.published);
    const group = map.get(label);
    if (group) {
      group.push(article);
    } else {
      map.set(label, [article]);
    }
  }

  return Array.from(map, ([label, articles]) => ({ label, articles }));
}

// ---- skeleton loader -------------------------------------------------------

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="ml-auto h-7 w-7 rounded-md" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

// ---- main component --------------------------------------------------------

export function ArticlesGrid() {
  const { filteredArticles, loading, error } = useFeed();

  const groups = useMemo(
    () => groupByDate(filteredArticles),
    [filteredArticles],
  );

  if (loading) {
    return <SkeletonGrid />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-lg font-medium">Failed to load articles</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Inbox className="size-10 text-muted-foreground" />
        <p className="text-lg font-medium">No articles found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.label}>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="shrink-0 text-sm font-semibold text-muted-foreground">
              {group.label}
            </h2>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.articles.map((article) => (
              <ArticleCard key={article.link} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
