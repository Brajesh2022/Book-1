export interface Book {
  title: string;
  author: string;
  description: string;
  poster: string;
  size: string;
  date: string;
  downloadLink: string;
}

export interface SearchResult {
  books: Book[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pages: number[];
}

export interface CacheItem<T> {
  timestamp: number;
  data: T;
}

export interface SearchParams {
  query: string;
  page?: number;
}

export interface BookSummary {
  title: string;
  author: string;
  summary: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}