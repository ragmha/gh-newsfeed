# Skill: Create Feature Component

## Description
Create a new feature component for the GitHub Feed UI.

## Template
```typescript
"use client";

import { useFeed } from "@/context/FeedProvider";
// Import shadcn/ui components as needed:
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// Icons from lucide-react:
// import { IconName } from "lucide-react";

export function MyComponent() {
  const { filteredArticles, loading } = useFeed();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Guidelines
- Always add `"use client"` directive at the top
- Use `useFeed()` context for all feed data and filter state
- Use `useBookmarks()` for bookmark functionality
- Use `useTheme()` for theme state
- Use shadcn/ui primitives — don't build custom inputs/buttons/cards
- Use `lucide-react` for all icons
- Use named exports (not default)
- Add to `src/components/` directory
- Wire into `src/app/page.tsx` inside the `<FeedProvider>` wrapper
- Use Tailwind v4 utility classes for styling
- Ensure responsive design (mobile-first)
