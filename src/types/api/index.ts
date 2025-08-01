export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
  validations?: Record<string, string>;
}
