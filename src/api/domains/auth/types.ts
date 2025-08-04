
import type { AuthenticatedUser as User } from "types/auth";
import type { Notification } from "@api/domains/notifications/types";

export type LoginCredentials = Pick<User, "username" | "password">;

export interface AuthenticatedUser extends Omit<User, "notifications"> {
  notifications?: Notification[];
}

export type LoginResponse = {
  user: AuthenticatedUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
  notifications: {
    unread: Notification[];
    unreadCount: number;
    total: number;
  };
};

export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
}; 