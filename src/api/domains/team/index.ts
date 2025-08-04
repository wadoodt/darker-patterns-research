/**
 * @file SDK methods for the Team domain.
 */
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { TeamMember, TeamMembersResponse, NewTeamMember, TeamMemberResponse } from "./types";

/**
 * Fetches a list of team members.
 * @param {object} [params] - Optional query parameters.
 * @param {number} [params.page] - The page number to fetch.
 * @param {number} [params.limit] - The number of items per page.
 * @returns {Promise<TeamMembersResponse>} A promise that resolves with the list of team members.
 */
const query = (params: { page?: number; limit?: number } = {}): Promise<TeamMembersResponse> => {
  return handleQuery<TeamMembersResponse>("/team", { params });
};

/**
 * Fetches a single team member by their ID.
 * @param {string} id - The ID of the team member to fetch.
 * @returns {Promise<TeamMemberResponse>} A promise that resolves with the team member's data.
 */
const get = (id: string): Promise<TeamMemberResponse> => {
  return handleQuery<TeamMemberResponse>(`/team/${id}`);
};

/**
 * Creates a new team member.
 * @param {NewTeamMember} newMember - The data for the new team member.
 * @returns {Promise<TeamMemberResponse>} A promise that resolves with the newly created team member's data.
 */
const create = (newMember: NewTeamMember): Promise<TeamMemberResponse> => {
  return handleMutation.post("/team", newMember);
};

/**
 * Updates an existing team member.
 * @param {Partial<TeamMember> & { id: string }} member - The team member data to update.
 * @returns {Promise<TeamMemberResponse>} A promise that resolves with the updated team member's data.
 */
const update = (
  member: Partial<TeamMember> & { id: string },
): Promise<TeamMemberResponse> => {
  return handleMutation.patch(`/team/${member.id}`, member);
};

/**
 * Deletes a team member by their ID.
 * @param {string} id - The ID of the team member to delete.
 * @returns {Promise<null>} A promise that resolves when the team member is successfully deleted.
 */
const remove = (id: string): Promise<null> => {
  return handleMutation.delete(`/team/${id}`);
};

export const team = {
  query,
  get,
  create,
  update,
  remove,
};
