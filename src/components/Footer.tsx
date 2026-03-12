"use client";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="mono text-xs text-muted-foreground">
          GitHub Feed Terminal v1.0
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs text-terminal-cyan vercel-transition hover:text-foreground"
          >
            github.blog
          </a>
          <a
            href="/data/feed.xml"
            className="mono text-xs text-muted-foreground vercel-transition hover:text-foreground"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
