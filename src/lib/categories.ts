export const CATEGORIES: Record<string, string[]> = {
  Platform: ["github-blog", "github-changelog"],
  Engineering: ["github-engineering"],
  Security: ["github-security"],
  "AI & Copilot": ["github-ai"],
  "Open Source": ["github-opensource"],
  Community: ["github-community", "github-education"],
  "Developer Tools": ["vscode-blog", "github-cli", "github-desktop"],
  Microsoft: ["ms-devblogs", "ms-learn"],
  Videos: ["github-youtube", "vscode-youtube"],
};

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
