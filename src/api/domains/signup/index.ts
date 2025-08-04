
import { handleMutation } from "@api/lib/handleMutation";
import type { SignupPayload, SignupResponse } from "./types";

/**
 * Signs up a new user.
 * @param {SignupPayload} payload - The user's signup information.
 * @returns {Promise<SignupResponse>} A promise that resolves with the new user's session information.
 */
const signup = (payload: SignupPayload): Promise<SignupResponse> => {
  return handleMutation.post("/signup", payload);
};

export const signupDomain = {
  signup,
};
