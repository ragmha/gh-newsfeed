export const CATEGORIES: Record<string, string[]> = {
  Platform: ["github-blog", "github-changelog", "github-product"],
  Engineering: ["github-engineering"],
  Security: ["github-security"],
  "AI & Copilot": ["github-ai"],
  "Open Source": ["github-opensource"],
  Community: ["github-community", "github-education"],
  "Developer Tools": ["vscode-blog", "github-cli", "github-desktop"],
};

/** All known blog IDs derived from CATEGORIES */
export const ALL_BLOG_IDS = Object.values(CATEGORIES).flat();

/** Reverse lookup: blogId → category name */
export const BLOG_TO_CATEGORY: Record<string, string> = Object.entries(
  CATEGORIES,
).reduce(
  (acc, [category, blogIds]) => {
    for (const id of blogIds) {
      acc[id] = category;
    }
    return acc;
  },
  {} as Record<string, string>,
);
