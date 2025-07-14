/**
 * @file Defines the API response constants and utility functions.
 * This file should be used for runtime logic, not for type definitions.
 */

import type { ApiResponse } from '../types/api';
import { RESPONSE_CODES, ERROR_CODES } from './codes';

// ------------------------------------------------------------------
// Utility Functions
// ------------------------------------------------------------------

/**
 * Creates a standardized success `ApiResponse` object for successful API calls.
 * This ensures all success responses across the application have a consistent shape.
 *
 * @template T The type of the data being returned.
 * @param {T} data The payload to be returned in the `data.data` field.
 * @param {keyof typeof RESPONSE_CODES} messageCode The success code from `RESPONSE_CODES`, used to look up the user-facing message.
 * @returns {ApiResponse<T>} A success `ApiResponse` object with a `data` property and a `null` error.
 */
export function createSuccessResponse<T>(
  data: T,
  messageCode: keyof typeof RESPONSE_CODES
): ApiResponse<T> {
  return {
    data: {
      ...data,
      message: RESPONSE_CODES[messageCode].message,
    },
    error: null,
  };
}

/**
 * Creates a standardized error `ApiResponse` object for failed API calls.
 * This ensures all error responses across the application have a consistent, predictable shape.
 *
 * @template T Should typically be `never` as no data is returned on error.
 * @param {keyof typeof ERROR_CODES} messageCode The error code from `ERROR_CODES`, used to look up the user-facing message.
 * @param {Record<string, string>} [validations] An optional map of validation errors, e.g., `{ email: 'Invalid email format' }`.
 * @returns {ApiResponse<T>} An error `ApiResponse` object with an `error` property and `null` data.
 */
export function createErrorResponse<T = never>(
  messageCode: keyof typeof ERROR_CODES,
  validations?: Record<string, string>
): ApiResponse<T> {
  return {
    data: null,
    error: {
      message: ERROR_CODES[messageCode].message,
      validations,
    },
  };
}
