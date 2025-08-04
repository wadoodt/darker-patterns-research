export interface PaginatedResponse<T> {
  currentPage: number;
  totalPages: number;
  total: number;
  faqs: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
  validations?: Record<string, string>;
}

export type { Notification } from "./notification";

