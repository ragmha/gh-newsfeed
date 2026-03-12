"use client";

import { useState, useCallback, useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

function loadBookmarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setBookmarks(loadBookmarks());
    setIsMounted(true);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify([...next]),
      );
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, []);

  const toggleBookmark = useCallback(
    (link: string) => {
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (next.has(link)) {
          next.delete(link);
        } else {
          next.add(link);
        }
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isBookmarked = useCallback(
    (link: string) => bookmarks.has(link),
    [bookmarks],
  );

  return { bookmarks, toggleBookmark, isBookmarked, isMounted } as const;
}
