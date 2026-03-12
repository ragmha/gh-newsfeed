/** Distinct colors for blog source tags */
export const BLOG_COLORS: Record<string, { bg: string; text: string }> = {
  "github-blog": { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-800 dark:text-blue-300" },
  "github-changelog": { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-800 dark:text-green-300" },
  "github-engineering": { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-800 dark:text-orange-300" },
  "github-security": { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-800 dark:text-red-300" },
  "github-ai": { bg: "bg-violet-100 dark:bg-violet-900/40", text: "text-violet-800 dark:text-violet-300" },
  "github-opensource": { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-800 dark:text-teal-300" },
  "github-community": { bg: "bg-pink-100 dark:bg-pink-900/40", text: "text-pink-800 dark:text-pink-300" },
  "github-education": { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-300" },
  "vscode-blog": { bg: "bg-cyan-100 dark:bg-cyan-900/40", text: "text-cyan-800 dark:text-cyan-300" },
  "github-cli": { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-800 dark:text-indigo-300" },
  "github-desktop": { bg: "bg-lime-100 dark:bg-lime-900/40", text: "text-lime-800 dark:text-lime-300" },
  "ms-devblogs": { bg: "bg-sky-100 dark:bg-sky-900/40", text: "text-sky-800 dark:text-sky-300" },
  "ms-learn": { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-300" },
  "github-youtube": { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-800 dark:text-rose-300" },
  "vscode-youtube": { bg: "bg-fuchsia-100 dark:bg-fuchsia-900/40", text: "text-fuchsia-800 dark:text-fuchsia-300" },
};

/** Fallback color for unknown blog sources */
export const DEFAULT_BLOG_COLOR = {
  bg: "bg-gray-100 dark:bg-gray-800",
  text: "text-gray-800 dark:text-gray-300",
};

/** Path to the pre-built feed data */
export const FEED_DATA_PATH =
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/data/feeds.json";

/** localStorage keys */
export const STORAGE_KEYS = {
  BOOKMARKS: "ghfeed-bookmarks",
  THEME: "ghfeed-theme",
} as const;
