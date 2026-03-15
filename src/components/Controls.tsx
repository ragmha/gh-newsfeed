"use client";

import { useFeed } from "@/context/FeedProvider";
import type { SortOption } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "blog", label: "By Blog" },
];

export function Controls() {
  const { sortBy, setSortBy } = useFeed();

  return (
    <div className="flex items-center justify-end py-2">
      <Select
        value={sortBy}
        onValueChange={(v) => setSortBy(v as SortOption)}
      >
        <SelectTrigger size="sm" className="w-35 rounded-md border-border bg-secondary text-xs">
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
  );
}
