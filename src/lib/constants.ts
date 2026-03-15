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

/** GitHub repo coordinates */
export const GITHUB_OWNER = "ragmha";
export const GITHUB_REPO = "gh-newsfeed";

/** Daily-digest issue API URL */
export const DIGEST_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=daily-digest&state=open&per_page=1&sort=created&direction=desc`;

/** localStorage keys */
export const STORAGE_KEYS = {
  BOOKMARKS: "ghfeed-bookmarks",
} as const;
