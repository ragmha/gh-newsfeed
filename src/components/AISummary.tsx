"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

const GITHUB_OWNER = "gh-newsfeed";
const GITHUB_REPO = "gh-newsfeed";
const DIGEST_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=daily-digest&state=open&per_page=1&sort=created&direction=desc`;

interface DigestState {
  loading: boolean;
  title: string | null;
  body: string | null;
  error: boolean;
}

export function AISummary() {
  const [digest, setDigest] = useState<DigestState>({
    loading: true,
    title: null,
    body: null,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchDigest() {
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

  // Hide on error or no data
  if (digest.error || (!digest.loading && !digest.body)) {
    return null;
  }

  if (digest.loading) {
    return (
      <div className="mb-6">
        <Card className="border-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 ring-1 ring-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Card className="border-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 ring-1 ring-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-purple-500" />
            <h2 className="text-base font-semibold">
              🤖 Today&apos;s Highlights
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          {/* Rendered as plain text — React auto-escapes. Never use dangerouslySetInnerHTML with external content. */}
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {typeof digest.body === "string" ? digest.body : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
