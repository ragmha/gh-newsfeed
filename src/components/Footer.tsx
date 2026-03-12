"use client";

import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>
          🐙 GitHub Feed · Updated daily via GitHub Actions ·{" "}
          <a
            href="/data/feed.xml"
            className="underline underline-offset-4 hover:text-foreground"
          >
            📡 RSS Feed
          </a>
        </p>
        <a
          href="https://github.com/gh-newsfeed/gh-newsfeed"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
