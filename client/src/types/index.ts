export interface Book {
  id: string;
  title: string;
  author: string;
  poster: string;
  size: string;
  format: string;
  downloadLink: string;
  description: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchResponse {
  books: Book[];
  pagination: Pagination;
  query: string;
  page: number;
  timestamp: string;
}

export interface SummaryResponse {
  title: string;
  author: string;
  summary: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message?: string;
}