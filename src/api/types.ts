/**
 * @file Central re-export hub for all public API types.
 * This allows for clean, consistent imports of API-related types
 * from a single module.
 *
 * @example
 * import type { TeamMember } from "@api/types";
 */

export type {
  TeamMember,
  TeamMembersResponse,
  NewTeamMember,
  CompanyRole,
  PlatformRole,
  UserStatus,
} from "./domains/team/types";

// We will re-export types from other domains here as they are created.
