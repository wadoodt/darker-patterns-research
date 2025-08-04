export type PlatformRole = "user" | "admin" | "representative" | "super-admin" | "qa";
export type UserStatus = "created" | "active" | "inactive" | "invited";

import type { Notification } from "@api/domains/notifications/types";

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

export interface AuthenticatedUser extends User {
  plan?: string;
  unreadNotifications?: Notification[];
}

export type UpdateUserPayload = Pick<User, "name">;