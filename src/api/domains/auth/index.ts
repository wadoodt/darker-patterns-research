
import apiClient from "@api/client";
import { handleMutation } from "@api/lib/handleMutation";
import type { LoginCredentials, LoginResponse } from "./types";

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return handleMutation(() => apiClient.post("/auth/login", credentials));
};

const logout = async (): Promise<void> => {
  return handleMutation(() => apiClient.post("/auth/logout"));
};

export const auth = {
  login,
  logout,
}; 