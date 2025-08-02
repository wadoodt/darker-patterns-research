
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

export const useLogout = () => {
  return {
    mutateAsync: async () => {
      return await auth.logout();
    },
    isLoading: false,
  };
}; 