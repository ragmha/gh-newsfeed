"use client";

import { useSyncExternalStore } from "react";
import { useTheme as useNextTheme } from "next-themes";

const subscribe = () => () => {};
function getSnapshot() { return true; }
function getServerSnapshot() { return false; }

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const theme = (mounted ? resolvedTheme ?? "light" : "light") as "light" | "dark";

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return { theme, toggleTheme, mounted } as const;
}
