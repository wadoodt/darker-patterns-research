
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { User, UpdateUserPayload } from "./types";
import type { AuthenticatedUser } from "types/auth";

/**
 * Fetches the currently authenticated user's profile.
 * @returns {Promise<AuthenticatedUser>} A promise that resolves with the user's data.
 */
const getMe = (): Promise<{ user: AuthenticatedUser }> => {
  return handleQuery<{ user: AuthenticatedUser }>("/users/me");
};

/**
 * Updates the currently authenticated user's profile.
 * @param {UpdateUserPayload} payload - The data to update.
 * @returns {Promise<User>} A promise that resolves with the updated user data.
 */
const updateMe = (payload: UpdateUserPayload): Promise<User> => {
  return handleMutation.patch("/users/me", payload);
};

export const users = {
  getMe,
  updateMe,
}; 