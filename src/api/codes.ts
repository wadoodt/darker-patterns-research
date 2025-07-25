/**
 * @file Defines the dictionaries for API response and error codes.
 * This file is dependency-free and can be safely imported anywhere.
 */

/**
 * A dictionary of successful response codes.
 * Using 'as const' makes it readonly and allows using keys as literal types.
 */
export const RESPONSE_CODES = {
  // --- Auth ---
  LOGIN_SUCCESS: {
    status: 200,
    message: "response.auth.login_success", // i18n key
  },
  SIGNUP_SUCCESS: {
    status: 201, // Use 201 for resource creation
    message: "response.auth.signup_success",
  },
  // --- General ---
  OPERATION_SUCCESS: {
    status: 200,
    message: "response.general.operation_success",
  },
  NO_DATA: {
    status: 200,
    message: "response.general.no_data",
  },
} as const;

/**
 * A dictionary of error codes.
 */
export const ERROR_CODES = {
  // --- General ---
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "error.general.internal_server_error",
  },
  NOT_FOUND: {
    status: 404,
    message: "error.general.not_found",
  },
  // --- Auth ---
  INVALID_CREDENTIALS: {
    status: 401,
    message: "error.auth.invalid_credentials",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "error.auth.unauthorized",
  },
  FORBIDDEN: {
    status: 403,
    message: "error.auth.forbidden",
  },
  // --- Validation ---
  VALIDATION_ERROR: {
    status: 422, // Unprocessable Entity
    message: "error.validation.validation_error",
  },
} as const;
