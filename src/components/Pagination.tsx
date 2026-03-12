"use client";

import { useFeed } from "@/context/FeedProvider";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ARTICLES_PER_PAGE } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build an array of page numbers + ellipsis markers to render. */
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Pagination() {
  const {
    filteredArticles,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useFeed();

  if (filteredArticles.length <= ARTICLES_PER_PAGE) return null;

  const pages = getPageRange(currentPage, totalPages);
  const start = (currentPage - 1) * ARTICLES_PER_PAGE + 1;
  const end = Math.min(currentPage * ARTICLES_PER_PAGE, filteredArticles.length);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4"
    >
      {/* Info */}
      <p className="mono text-xs text-muted-foreground">
        {start}&ndash;{end} of {filteredArticles.length}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>

        {/* Prev */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="mono text-xs text-muted-foreground px-1 select-none"
            >
              &hellip;
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="icon"
              className="size-8 mono text-xs"
              onClick={() => setCurrentPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>

        {/* Last */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
