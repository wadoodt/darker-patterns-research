
import { auth } from "./index";
import type { LoginCredentials } from "./types";

export const useLogin = () => {
  return {
    mutateAsync: async (credentials: LoginCredentials) => {
      const result = await auth.login(credentials);
      console.log('useLogin: ',result);
      return result;
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