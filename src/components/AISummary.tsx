"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";
import { DIGEST_API_URL } from "@/lib/constants";

interface DigestState {
  loading: boolean;
  title: string | null;
  body: string | null;
  error: boolean;
}

/** Render a minimal subset of markdown to React elements (links, bold, headers, lists). */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = renderInline(headingMatch[2]);
      const className =
        level <= 2
          ? "text-sm font-semibold text-foreground mt-3 mb-1"
          : "text-sm font-medium text-foreground mt-2 mb-1";
      elements.push(
        <div key={i} className={className}>
          {content}
        </div>
      );
      continue;
    }

    // Numbered list items
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="pl-4 py-0.5 text-sm text-muted-foreground">
          {renderInline(line)}
        </div>
      );
      continue;
    }

    // Bullet list items
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="pl-4 py-0.5 text-sm text-muted-foreground">
          • {renderInline(bulletMatch[1])}
        </div>
      );
      continue;
    }

    // Empty lines → small spacer
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed text-muted-foreground">
        {renderInline(line)}
      </p>
    );
  }

  return elements;
}

/** Render inline markdown: bold, links, bold+links, and plain text. */
function renderInline(text: string): React.ReactNode[] {
  // Match: **[text](url)**, [text](url), **text**, or plain text
  const parts: React.ReactNode[] = [];
  const regex =
    /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // **[text](url)** — bold link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-foreground transition-colors"
        >
          {match[1]}
        </a>
      );
    } else if (match[3] && match[4]) {
      // [text](url) — regular link
      parts.push(
        <a
          key={match.index}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-foreground transition-colors"
        >
          {match[3]}
        </a>
      );
    } else if (match[5]) {
      // **text** — bold
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[5]}
        </strong>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function AISummary() {
  const [digest, setDigest] = useState<DigestState>({
    loading: false,
    title: null,
    body: null,
    error: false,
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDigest() {
      if (!cancelled) setDigest((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch(DIGEST_API_URL);

        if (!res.ok) {
          // Rate limit or other API error — hide silently
          if (!cancelled) setDigest({ loading: false, title: null, body: null, error: true });
          return;
        }

        const issues = await res.json();

        if (!cancelled) {
          if (!Array.isArray(issues) || issues.length === 0) {
            setDigest({ loading: false, title: null, body: null, error: false });
          } else {
            setDigest({
              loading: false,
              title: issues[0].title ?? "Today's Highlights",
              body: issues[0].body ?? null,
              error: false,
            });
          }
        }
      } catch {
        if (!cancelled) setDigest({ loading: false, title: null, body: null, error: true });
      }
    }

    fetchDigest();
    return () => {
      cancelled = true;
    };
  }, []);

  const rendered = useMemo(
    () => (digest.body ? renderMarkdown(digest.body) : null),
    [digest.body]
  );

  // Hide on error or no data
  if (digest.error || (!digest.loading && !digest.body)) {
    return null;
  }

  if (digest.loading) {
    return (
      <div className="mb-6">
        <Card className="rounded-lg border border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="mt-2 h-3 w-3/4 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Card className="rounded-lg border border-border bg-card">
        <CardHeader>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 text-left"
            onClick={() => setExpanded((e) => !e)}
          >
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-muted-foreground" />
              <h2 className="mono text-sm font-medium">
                Today&apos;s Highlights
              </h2>
            </div>
            {expanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        <CardContent>
          <div className={expanded ? "" : "max-h-48 overflow-hidden relative"}>
            {rendered}
            {!expanded && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
            )}
          </div>
          {!expanded && (
            <button
              type="button"
              className="mt-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setExpanded(true)}
            >
              Show full digest →
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
