"use client";

import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

type Theme = "light" | "dark";

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

const themeSubscribers = new Set<() => void>();
function subscribe(cb: () => void) {
  themeSubscribers.add(cb);
  // Apply theme on first subscription (initial mount)
  applyTheme(getTheme());
  return () => themeSubscribers.delete(cb);
}

function getSnapshot(): Theme {
  return getTheme();
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, next);
    } catch {
      // Storage unavailable
    }
    themeSubscribers.forEach((cb) => cb());
  }, []);

  return { theme, toggleTheme } as const;
}
