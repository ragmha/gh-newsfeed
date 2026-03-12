"use client";

import { useFeed } from "@/context/FeedProvider";
import type { SortOption, DateFilter } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "blog", label: "By Blog" },
];

export function Controls() {
  const {
    articles,
    filteredArticles,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
  } = useFeed();

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: article count */}
      <p className="mono text-xs text-muted-foreground">
        Showing{" "}
        <span className="text-foreground">
          {filteredArticles.length}
        </span>{" "}
        of{" "}
        <span className="text-foreground">{articles.length}</span>{" "}
        articles
      </p>

      {/* Right: selects */}
      <div className="flex items-center gap-2">
        <Select
          value={dateFilter}
          onValueChange={(v) => setDateFilter(v as DateFilter)}
        >
          <SelectTrigger size="sm" className="w-[130px] rounded-md border-border bg-secondary text-xs">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            {DATE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger size="sm" className="w-[140px] rounded-md border-border bg-secondary text-xs">
            <SelectValue placeholder="Sort by" />
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
  );
}
