// Extracted from the original src/types/api/user.ts

import { RESPONSE_CODES } from "@api/codes";

export type PlatformRole = "user" | "admin" | "representative" | "super-admin" | "qa";
export type CompanyRole = "owner" | "manager" | "employee";
export type UserStatus = "created" | "active" | "inactive" | "invited";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  username: string;
  platformRole: PlatformRole;
  companyId: string;
  status: UserStatus;
  companyRole?: CompanyRole;
  lastActive?: string;
  password?: string;
};

export type NewTeamMember = Pick<TeamMember, "name" | "email"> & {
  companyRole: CompanyRole;
};

export type TeamMembersResponse = {
  members: TeamMember[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
};

export type ApiSuccess<T> = T & {
  message: (typeof RESPONSE_CODES)[keyof typeof RESPONSE_CODES]["message"];
};
