
import { handleMutation } from "@api/lib/handleMutation";
import type { LoginCredentials, LoginResponse } from "./types";

/**
 * Logs a user in by sending their credentials to the backend.
 * @param {LoginCredentials} credentials - The user's email and password.
 * @returns {Promise<LoginResponse>} A promise that resolves with the login response data.
 */
const login = (credentials: LoginCredentials): Promise<{ auth: LoginResponse }> => {
  return handleMutation.post("/auth/login", credentials);
};

/**
 * Logs the current user out.
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
 */
const logout = (): Promise<void> => {
  return handleMutation.post("/auth/logout", {});
};

export const auth = {
  login,
  logout,
}; 