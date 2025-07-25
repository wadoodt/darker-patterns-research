/**
 * @file Defines the core data structures for the standardized API response.
 * These types are shared between the frontend and backend.
 */

// These imports are necessary because the types reference the code dictionaries.
// Using `type` ensures they are erased at compile time and cause no circular dependencies.
import type { RESPONSE_CODES, ERROR_CODES } from "@api/codes";

/**
 * Represents a successful API response payload.
 * @template T The type of the primary data.
 */
export type ApiSuccess<T> = T & {
  message: (typeof RESPONSE_CODES)[keyof typeof RESPONSE_CODES]["message"];
};

/**
 * Represents an error API response payload.
 */
export type ApiError = {
  message: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]["message"];
  // Optional field for detailed form validation errors, mapping field names to error messages/keys.
  validations?: Record<string, string>;
};

/**
 * A generic and type-safe wrapper for all API responses.
 * It follows the Result pattern, containing either 'data' or 'error', but not both.
 * @template T The type of the data expected in a successful response.
 */
export type ApiResponse<T> =
  | { data: ApiSuccess<T>; error: null }
  | { data: null; error: ApiError };

/**
 * Represents the structure of a User object.
 */
export type { User, UserProfile, UserSettings, CreateUserPayload } from "./user";
export type { TeamMember, TeamMembersResponse, NewTeamMember } from "./team";



/**
 * Represents the structure of a Company object.
 */
export type Company = {
  id: string;
  name: string;
  plan: "Enterprise" | "Pro" | "Free";
  stripeCustomerId: string;
  status: "active" | "inactive" | "past_due";
};

/**
 * Represents the structure of the admin settings object.
 */
export type AdminSettings = {
  id: string;
  featureFlags: {
    enableNewDashboard: boolean;
    enableBetaFeatures: boolean;
  };
  blockedFeatures: string[];
};
