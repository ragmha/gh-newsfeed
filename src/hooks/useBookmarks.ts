"use client";

import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

// Cached snapshot to ensure referential stability for useSyncExternalStore
let cachedRaw: string | null = null;
let cachedSet: Set<string> = new Set();

function getSnapshot(): Set<string> {
  const raw = typeof window === "undefined"
    ? null
    : localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSet = raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      cachedSet = new Set();
    }
  }
  return cachedSet;
}

const SERVER_SNAPSHOT: Set<string> = new Set<string>();
function getServerSnapshot(): Set<string> {
  return SERVER_SNAPSHOT;
}

const subscribers = new Set<() => void>();
function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

function notifySubscribers() {
  // Invalidate cache so next getSnapshot reads fresh data
  cachedRaw = null;
  subscribers.forEach((cb) => cb());
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleBookmark = useCallback(
    (link: string) => {
      const current = getSnapshot();
      const next = new Set(current);
      if (next.has(link)) {
        next.delete(link);
      } else {
        next.add(link);
      }
      try {
        localStorage.setItem(
          STORAGE_KEYS.BOOKMARKS,
          JSON.stringify([...next]),
        );
      } catch {
        // Storage full or unavailable
      }
      notifySubscribers();
    },
    [],
  );

  const isBookmarked = useCallback(
    (link: string) => bookmarks.has(link),
    [bookmarks],
  );

  const isMounted = typeof window !== "undefined";

  return { bookmarks, toggleBookmark, isBookmarked, isMounted } as const;
}
