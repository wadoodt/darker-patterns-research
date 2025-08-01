
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { User, UpdateUserPayload } from "./types";
import type { Notification } from "@api/domains/notifications/types";

export type UserMeResponse = User & {
  plan?: string;
  createdAt?: string;
  updatedAt?: string;
};

const getMe = async (): Promise<{ user: UserMeResponse; unreadNotifications: Notification[] }> => {
  return handleQuery(() => apiClient.get("/users/me"));
};

const updateMe = async (payload: UpdateUserPayload): Promise<{ user: User }> => {
  return handleMutation(() => apiClient.patch("/users/me", payload));
};

export const users = {
  getMe,
  updateMe,
}; 