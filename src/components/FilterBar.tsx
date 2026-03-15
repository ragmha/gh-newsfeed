"use client";

import { useFeed } from "@/context/FeedProvider";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import type { DateFilter, SortOption } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const DATE_TABS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "week", label: "7d" },
  { value: "month", label: "30d" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest" },
  { value: "date-asc", label: "Oldest" },
  { value: "blog", label: "Source" },
];

const CATEGORY_NAMES = Object.keys(CATEGORIES);

export function FilterBar() {
  const {
    filteredArticles,
    currentCategory,
    setCurrentCategory,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
  } = useFeed();

  return (
    <div className="border-b border-border bg-card/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center px-4 min-w-0">
        {/* Category pills — horizontal scroll */}
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide min-w-0">
          <button
            onClick={() => setCurrentCategory(null)}
            aria-current={!currentCategory ? "true" : undefined}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium vercel-transition",
              !currentCategory
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {CATEGORY_NAMES.map((name) => (
            <button
              key={name}
              onClick={() =>
                setCurrentCategory(currentCategory === name ? null : name)
              }
              aria-current={currentCategory === name ? "true" : undefined}
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-xs font-medium vercel-transition",
                currentCategory === name
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Spacer (desktop only) */}
        <div className="hidden sm:block flex-1" />

        {/* Date range + sort + count */}
        <div className="flex items-center gap-2 pb-2.5 sm:pb-0 mono text-xs overflow-x-auto scrollbar-hide">
          {DATE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setDateFilter(tab.value)}
              aria-current={dateFilter === tab.value ? "true" : undefined}
              className={cn(
                "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium vercel-transition",
                dateFilter === tab.value
                  ? "bg-terminal-cyan/15 text-terminal-cyan"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
          <span role="status" className="pl-3 text-muted-foreground tabular-nums">
            {filteredArticles.length} results
          </span>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger size="sm" className="ml-2 w-24 rounded border-border bg-secondary text-xs shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
