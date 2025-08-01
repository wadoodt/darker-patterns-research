// Extracted from the original src/types/api/user.ts

import { RESPONSE_CODES } from "@api/codes";
import type { PlatformRole, UserStatus } from "@api/domains/users/types";

// Re-export types for compatibility
export type { PlatformRole, UserStatus };

export type CompanyRole = "owner" | "manager" | "employee";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  username:string;
  platformRole: PlatformRole;
  companyId: string;
  status: UserStatus;
  companyRole?: CompanyRole;
  lastActive?: string;
  password?: string;
}

export type NewTeamMember = Pick<TeamMember, "name" | "email"> & {
  companyRole: CompanyRole;
}

export type TeamMembersResponse = {
  members: TeamMember[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
}

export type ApiSuccess<T> = T & {
  message: (typeof RESPONSE_CODES)[keyof typeof RESPONSE_CODES]["message"];
}
