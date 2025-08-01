
import { auth } from "./index";
import type { LoginCredentials } from "./types";

export const useLogin = () => {
  return {
    mutateAsync: async (credentials: LoginCredentials) => {
      return await auth.login(credentials);
    },
    isLoading: false,
  };
}; 