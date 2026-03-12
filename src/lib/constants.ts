/** Category badge colors (bg + text + border) */
export const CATEGORY_COLORS: Record<string, string> = {
  Platform: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Engineering: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Security: "bg-red-500/20 text-red-400 border-red-500/30",
  "AI & Copilot": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Open Source": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Community: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Developer Tools": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Microsoft: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Videos: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};
export const DEFAULT_CATEGORY_COLOR = "bg-gray-500/20 text-gray-400 border-gray-500/30";

/** Blog source text colors (used in table rows) */
export const BLOG_TAG_COLORS: Record<string, string> = {
  "github-blog": "text-blue-400",
  "github-changelog": "text-green-400",
  "github-engineering": "text-orange-400",
  "github-security": "text-red-400",
  "github-ai": "text-violet-400",
  "github-opensource": "text-teal-400",
  "github-community": "text-pink-400",
  "github-education": "text-amber-400",
  "vscode-blog": "text-cyan-400",
  "github-cli": "text-indigo-400",
  "github-desktop": "text-lime-400",
  "ms-devblogs": "text-sky-400",
  "ms-learn": "text-emerald-400",
  "github-youtube": "text-rose-400",
  "vscode-youtube": "text-fuchsia-400",
};

/** Path to the pre-built feed data */
export const FEED_DATA_PATH =
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/data/feeds.json";

/** Number of articles per page */
export const ARTICLES_PER_PAGE = 30;

/** localStorage keys */
export const STORAGE_KEYS = {
  BOOKMARKS: "ghfeed-bookmarks",
  THEME: "ghfeed-theme",
} as const;
