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
import { notifications } from "./domains/notifications";
import * as notificationHooks from "./domains/notifications/hooks";
import { support } from "./domains/support";

const api = {
  team,
  notifications: {
    ...notifications,
    ...notificationHooks,
  },
  support,
};

export default api;
