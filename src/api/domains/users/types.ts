export type PlatformRole = "user" | "admin" | "representative" | "super-admin" | "qa";
export type UserStatus = "created" | "active" | "inactive" | "invited";

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  platformRole: PlatformRole;
  companyId: string;
  status: UserStatus;
  password?: string;
};

export type UpdateUserPayload = Partial<Omit<User, "id" | "password" | "platformRole" | "companyId" | "status">>;