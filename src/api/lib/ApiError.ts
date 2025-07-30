/**
 * @file Defines a custom error class for standardized API errors.
 */
import type { ApiError as ApiErrorResponse } from "types/api";

/**
 * A custom error class to standardize errors thrown by the API SDK.
 * This is primarily used by query methods, which are designed to throw on failure.
 * It encapsulates the entire error response from the API.
 */
export class ApiError extends Error {
  public readonly validations?: Record<string, string>;

  constructor(error: ApiErrorResponse) {
    // The `message` from the API error object is the i18n key.
    super(error.message);
    this.name = "ApiError";
    this.validations = error.validations;
  }
}
