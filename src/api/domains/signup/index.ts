
import apiClient from "@api/client";
import { handleMutation } from "@api/lib/handleMutation";
import type { SignupPayload, SignupResponse } from "./types";

const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
  return handleMutation(() => apiClient.post("/signup", payload));
};

export const auth = {
  signup,
};
