/**
 * Represents the user object as it exists in the application state after authentication.
 */
import type { User } from "@api/domains/users/types";
import type { CompanyRole } from "@api/types";
import type { Notification } from "@api/domains/notifications/types";

/**
 * Represents the user object as it exists in the application state after authentication.
 * This should be kept in sync with the `User` type from the API.
 */
export interface AuthenticatedUser extends User {
  companyRole?: CompanyRole;
  plan: "Enterprise" | "Pro" | "Free";
  createdAt: string;
  updatedAt: string;
  /**
   * Initial notifications from user/me endpoint
   * These are used to show the bell indicator immediately on login
   * and are merged with paginated notifications when dropdown is opened
   */
  unreadNotifications?: Notification[];
}
