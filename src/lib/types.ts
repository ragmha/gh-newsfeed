export interface Article {
  title: string;
  link: string;
  published: string; // ISO date string
  summary: string;
  blog: string; // display name
  blogId: string; // key identifier
  category: string;
  author: string;
}

export interface FeedData {
  lastUpdated: string;
  totalArticles: number;
  articles: Article[];
  summary?: string; // optional AI-generated summary
}

export type SortOption = "date-desc" | "date-asc" | "blog";
export type DateFilter = "all" | "today" | "week" | "month";
