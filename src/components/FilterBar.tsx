"use client";

import { useMemo } from "react";
import { useFeed } from "@/context/FeedProvider";
import { CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Readable display names for blog IDs
const BLOG_DISPLAY_NAMES: Record<string, string> = {
  "github-blog": "GitHub Blog",
  "github-changelog": "Changelog",
  "github-product": "Product",
  "github-engineering": "Engineering",
  "github-security": "Security",
  "github-ai": "AI & Copilot",
  "github-opensource": "Open Source",
  "github-community": "Community",
  "github-education": "Education",
  "vscode-blog": "VS Code",
  "github-cli": "GitHub CLI",
  "github-desktop": "Desktop",
};

export function FilterBar() {
  const {
    articles,
    currentCategory,
    setCurrentCategory,
    currentFilter,
    setCurrentFilter,
  } = useFeed();

  // Count articles per category (from all articles, not filtered)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    for (const [category, blogIds] of Object.entries(CATEGORIES)) {
      counts[category] = articles.filter((a) =>
        blogIds.includes(a.blogId),
      ).length;
    }
    return counts;
  }, [articles]);

  // Count articles per blog within the active category
  const blogCounts = useMemo(() => {
    if (!currentCategory || !CATEGORIES[currentCategory]) return {};
    const blogIds = CATEGORIES[currentCategory];
    const counts: Record<string, number> = {};
    for (const blogId of blogIds) {
      counts[blogId] = articles.filter((a) => a.blogId === blogId).length;
    }
    return counts;
  }, [articles, currentCategory]);

  const categoryNames = Object.keys(CATEGORIES);
  const activeBlogIds = currentCategory ? CATEGORIES[currentCategory] ?? [] : [];
  const categoryTotal = currentCategory ? categoryCounts[currentCategory] ?? 0 : 0;

  return (
    <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category pills */}
        <ScrollArea className="w-full">
          <div className="flex items-center gap-1.5 py-3">
            <CategoryPill
              label="All"
              count={categoryCounts.all}
              active={!currentCategory}
              onClick={() => setCurrentCategory(null)}
            />
            {categoryNames.map((name) => (
              <CategoryPill
                key={name}
                label={name}
                count={categoryCounts[name] ?? 0}
                active={currentCategory === name}
                onClick={() => setCurrentCategory(name)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Blog sub-pills (only when a category is selected and has multiple blogs) */}
        {currentCategory && activeBlogIds.length > 1 && (
          <ScrollArea className="w-full">
            <div className="flex items-center gap-1.5 border-t border-border/50 py-2">
              <BlogPill
                label={`All in ${currentCategory}`}
                count={categoryTotal}
                active={!currentFilter}
                onClick={() => setCurrentFilter(null)}
              />
              {activeBlogIds.map((blogId) => (
                <BlogPill
                  key={blogId}
                  label={BLOG_DISPLAY_NAMES[blogId] ?? blogId}
                  count={blogCounts[blogId] ?? 0}
                  active={currentFilter === blogId}
                  onClick={() => setCurrentFilter(blogId)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pill sub-components                                                 */
/* ------------------------------------------------------------------ */

interface PillProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function CategoryPill({ label, count, active, onClick }: PillProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="shrink-0"
    >
      {label}
      <span
        className={
          active
            ? "ml-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] leading-none"
            : "ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] leading-none text-muted-foreground"
        }
      >
        {count}
      </span>
    </Button>
  );
}

function BlogPill({ label, count, active, onClick }: PillProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="xs"
      onClick={onClick}
      className="shrink-0"
    >
      {label}
      <span className="ml-1 text-[10px] text-muted-foreground">{count}</span>
    </Button>
  );
}
