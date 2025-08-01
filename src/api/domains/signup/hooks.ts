
import { auth } from "./index";
import type { SignupPayload } from "./types";

export const useSignup = () => {
  return {
    mutate: async (payload: SignupPayload, options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => {
      try {
        const result = await auth.signup(payload);
        options?.onSuccess?.();
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
    isLoading: false,
  };
};
