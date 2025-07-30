/**
 * @file SDK methods for the Team domain.
 */
import apiClient from "@api/client";
import { handleRequest } from "@api/lib/handleRequest";
import { ApiError } from "@api/lib/ApiError";
import type { ApiResponse } from "types";
import type { TeamMember, TeamMembersResponse, NewTeamMember, ApiSuccess } from "./types";

/**
 * Fetches a list of team members.
 * This is a QUERY method. It will throw an `ApiError` on failure.
 * @returns A promise that resolves to the unwrapped team members response data.
 */
const query = async (): Promise<TeamMembersResponse> => {
  const response = await handleRequest(() => apiClient.get("/team"));

  if (response.error) {
    throw new ApiError(response.error);
  }

  // On success, the `data` property of ApiResponse is actually an ApiSuccess object.
  // We need to unwrap the data from it.
  const { message, ...data } = response.data;
  console.log(message); // The message can be used for logging or future enhancements
  return data as TeamMembersResponse;
};

/**
 * Creates a new team member.
 * This is a MUTATION method. It will return the full ApiResponse object.
 * @param newMember - The data for the new team member.
 * @returns A promise that resolves to the full `ApiResponse` object.
 */
const create = async (newMember: NewTeamMember): Promise<ApiResponse<ApiSuccess<TeamMember>>> => {
  return handleRequest(() => apiClient.post("/team", newMember));
};

/**
 * Updates an existing team member.
 * This is a MUTATION method. It will return the full ApiResponse object.
 * @param member - The member data to update.
 * @returns A promise that resolves to the full `ApiResponse` object.
 */
const update = async (
  member: Partial<TeamMember> & { id: string },
): Promise<ApiResponse<ApiSuccess<TeamMember>>> => {
  return handleRequest(() => apiClient.patch(`/team/${member.id}`, member));
};

/**
 * Deletes a team member by their ID.
 * This is a MUTATION method. It will return the full ApiResponse object.
 * @param id - The ID of the member to delete.
 * @returns A promise that resolves to the full `ApiResponse` object.
 */
const remove = async (id: string): Promise<ApiResponse<null>> => {
  return handleRequest(() => apiClient.delete(`/team/${id}`));
};

export const team = {
  query,
  create,
  update,
  remove,
};
