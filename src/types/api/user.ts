export type PlatformRole = "user" | "admin" | "representative" | "super-admin" | "qa";
export type CompanyRole = "owner" | "manager" | "employee";
export type UserStatus = "created" | "active" | "inactive" | "invited";

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  platformRole: PlatformRole;
  companyId: string;
  status: UserStatus;
  // Team-specific properties (only relevant when user is part of a company)
  companyRole?: CompanyRole;
  lastActive?: string;
  // The password should never be sent to the client, but is here for mock DB purposes.
  password?: string;
};

export type UserProfile = {
  bio: string;
  avatarUrl: string;
};

export type UserSettings = {
  theme: "light" | "dark";
  notifications: {
    email: boolean;
    push: boolean;
  };
};

export type CreateUserPayload = Omit<User, "id" | "status"> & {
  password: string;
};

export type NewTeamMember = Pick<User, "name" | "email"> & {
  companyRole: CompanyRole;
};

export type TeamMembersResponse = {
  members: User[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
};
