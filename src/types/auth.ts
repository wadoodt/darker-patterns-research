/**
 * Represents the user object as it exists in the application state after authentication.
 */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super-admin" | "qa";
  plan: "Enterprise" | "Pro" | "Free";
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}
