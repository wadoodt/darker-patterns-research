import type { User, Company } from "./api";

/**
 * Represents the user object as it exists in the application state after authentication.
 * It extends the base User type with the company's plan.
 */
export type AuthenticatedUser = User & {
  plan: Company["plan"];
};
