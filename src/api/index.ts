/**
 * @file Main entry point for the application's API SDK.
 * This file composes and exports all the individual API domains.
 * The rest of the application should import API methods from this file.
 *
 * @example
 * import api from "@api";
 *
 * const members = await api.team.getMembers();
 */
import { team } from "./domains/team";

const api = {
  team,
  // Other domains like 'users', 'auth', etc., will be added here.
};

export default api;
