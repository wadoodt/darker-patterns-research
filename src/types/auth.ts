/**
 * Represents the user object as it exists in the application state after authentication.
 */
import type { PlatformRole, CompanyRole, UserStatus } from "./api/user";

/**
 * Represents the user object as it exists in the application state after authentication.
 * This should be kept in sync with the `User` type from the API.
 */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  platformRole: PlatformRole;
  companyId: string;
  status: UserStatus;
  companyRole?: CompanyRole;
  plan: "Enterprise" | "Pro" | "Free";
  createdAt: string;
  updatedAt: string;
}
