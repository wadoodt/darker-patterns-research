
import apiClient from "@api/client";
import { handleMutation } from "@api/lib/handleMutation";
import type { LoginCredentials, LoginResponse } from "./types";

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return handleMutation(() => apiClient.post("/auth/login", credentials));
};

export const auth = {
  login,
}; 