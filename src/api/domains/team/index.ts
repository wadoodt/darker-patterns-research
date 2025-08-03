/**
 * @file SDK methods for the Team domain.
 */
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { ApiResponse } from "types/api";
import type { TeamMember, TeamMembersResponse, NewTeamMember, ApiSuccess } from "./types";

/**
 * Fetches a list of team members.
 * This is a QUERY method, so it uses the `handleQuery` utility.
 */
const query = async (params: { page?: number; limit?: number } = {}): Promise<TeamMembersResponse> => {
  return handleQuery(() => apiClient.get("/team", { params }));
};

/**
 * Fetches a single team member by their ID.
 */
const get = async (id: string): Promise<ApiResponse<ApiSuccess<TeamMember>>> => {
  return handleQuery(() => apiClient.get(`/team/${id}`));
};

/**
 * Creates a new team member.
 * This is a MUTATION method, so it uses the `handleMutation` utility.
 */
const create = async (newMember: NewTeamMember): Promise<ApiResponse<ApiSuccess<TeamMember>>> => {
  return handleMutation(() => apiClient.post("/team", newMember));
};

/**
 * Updates an existing team member.
 * This is a MUTATION method, so it uses the `handleMutation` utility.
 */
const update = async (
  member: Partial<TeamMember> & { id: string },
): Promise<ApiResponse<ApiSuccess<TeamMember>>> => {
  return handleMutation(() => apiClient.patch(`/team/${member.id}`, member));
};

/**
 * Deletes a team member by their ID.
 * This is a MUTATION method, so it uses the `handleMutation` utility.
 */
const remove = async (id: string): Promise<ApiResponse<null>> => {
  return handleMutation(() => apiClient.delete(`/team/${id}`));
};

export const team = {
  query,
  get,
  create,
  update,
  remove,
};
