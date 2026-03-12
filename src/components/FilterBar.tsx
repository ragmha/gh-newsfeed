"use client";

import { useFeed } from "@/context/FeedProvider";
import { CATEGORIES } from "@/lib/categories";
import type { DateFilter } from "@/lib/types";

const DATE_TABS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "week", label: "7d" },
  { value: "month", label: "30d" },
];

export function FilterBar() {
  const {
    filteredArticles,
    currentCategory,
    setCurrentCategory,
    dateFilter,
    setDateFilter,
  } = useFeed();

  const categoryNames = Object.keys(CATEGORIES);

  return (
    <div className="border-b border-border bg-card/50 overflow-x-auto">
      <div className="flex items-center min-w-max px-3 sm:px-4">
        {/* Category tabs */}
        <div className="flex items-center gap-0 mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setCurrentCategory(null)}
            className={`px-3 py-2.5 border-b-2 vercel-transition ${
              !currentCategory
                ? "border-terminal-green terminal-green"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categoryNames.map((name) => (
            <button
              key={name}
              onClick={() =>
                setCurrentCategory(currentCategory === name ? null : name)
              }
              className={`px-3 py-2.5 border-b-2 vercel-transition ${
                currentCategory === name
                  ? "border-terminal-green terminal-green"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Date range + count */}
        <div className="flex items-center gap-0 mono text-xs">
          {DATE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setDateFilter(tab.value)}
              className={`px-2.5 py-2.5 border-b-2 vercel-transition ${
                dateFilter === tab.value
                  ? "border-terminal-cyan terminal-cyan"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="pl-3 text-muted-foreground tabular-nums">
            {filteredArticles.length} results
          </span>
        </div>
      </div>
    </div>
  );
}
