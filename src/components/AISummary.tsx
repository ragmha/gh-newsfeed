"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { DIGEST_API_URL } from "@/lib/constants";

interface DigestState {
  loading: boolean;
  title: string | null;
  body: string | null;
  error: boolean;
}

export function AISummary() {
  const [digest, setDigest] = useState<DigestState>({
    loading: false,
    title: null,
    body: null,
    error: false,
  });

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
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-muted-foreground" />
            <h2 className="mono text-sm font-medium">
              Today&apos;s Highlights
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {digest.body}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
