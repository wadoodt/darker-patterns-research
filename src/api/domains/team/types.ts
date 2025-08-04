// Extracted from the original src/types/api/user.ts

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
  companyRole: CompanyRole;
  lastActive?: string;
  password?: string;
}

export type NewTeamMember = Pick<TeamMember, "name" | "email"> & {
  companyRole: CompanyRole;
}

export type TeamMembersResponse = {
  teamMembers: TeamMember[];
  page: number;
  totalPages: number;
  totalItems: number;
};

export type TeamMemberResponse = {
  teamMember: TeamMember;
};
