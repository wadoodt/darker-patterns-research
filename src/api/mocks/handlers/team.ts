import { db } from "../db";
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from "../../response";
import { getAuthenticatedUser, handleUnauthorized } from "../authUtils";
import type { TeamMember, NewTeamMember } from "@api/types";
import { mockUsers } from "../data/users";
import { mockCompanies } from "../data/companies";
import type { Company } from "types";
import type { AuthenticatedUser } from "types/auth";

// Helper function to get team members
const fetchTeamMembers = (companyId: string, userCanReadAll: boolean = false): TeamMember[] => {
  const company = mockCompanies.find((c: Company) => c.id === companyId);
  if (!company) return [];

  const filterUsers = userCanReadAll
    ? mockUsers
    : mockUsers.filter(
        (user: TeamMember) =>
          user.companyId === companyId && user.status !== "inactive"
      );
  return filterUsers;
};

export const createTeamMember = async (request: Request): Promise<Response> => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const { name, email, companyRole } =
      (await request.json()) as NewTeamMember;

    if (!name || !email || !companyRole) {
      return createErrorResponse("VALIDATION_ERROR", "Missing required fields");
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name,
      email,
      username: email.split("@")[0],
      platformRole: "user",
      companyId: user.companyId,
      companyRole,
      status: "invited",
      lastActive: "-",
    };

    db.users.create(newMember);

    return createSuccessResponse("OPERATION_SUCCESS", "teamMember", newMember);
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to create team member");
  }
};

export const getTeamMembers = (request: Request): Response => {
  const user = getAuthenticatedUser(request) as AuthenticatedUser;
  if (!user) return handleUnauthorized();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const allMembers = fetchTeamMembers(user.companyId, user.platformRole === "super-admin" || user.platformRole === "qa");
  const totalMembers = allMembers.length;
  if (totalMembers === 0) {
    return createPaginatedResponse(
      "NO_DATA",
      "teamMembers",
      [],
      0,
      0,
      0
    );
  }
  const totalPages = Math.ceil(totalMembers / limit);
  const data = allMembers.slice((page - 1) * limit, page * limit);

  return createPaginatedResponse(
    "OPERATION_SUCCESS",
    "teamMembers",
    data,
    page,
    totalPages,
    totalMembers
  );
};

export const deleteTeamMember = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const authUser = getAuthenticatedUser(request) as AuthenticatedUser;
    if (!authUser) return handleUnauthorized();

    // New check: Managers cannot delete members
    if (authUser.companyRole === 'manager') {
      return createErrorResponse("FORBIDDEN", "Managers cannot delete team members");
    }

    const { id } = params;
    const memberToDelete = db.users.findFirst({
      where: { id: id },
    });

    if (!memberToDelete) {
      return createErrorResponse("NOT_FOUND", `Team member with id ${id} not found`);
    }

    if (memberToDelete.companyId !== authUser.companyId) {
      return createErrorResponse("FORBIDDEN", "Forbidden");
    }

    db.users.delete({ where: { id: id } });

    return createSuccessResponse("OPERATION_SUCCESS", "teamMember", {});
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to delete team member");
  }
};

export const updatePlatformRole = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const authUser = getAuthenticatedUser(request) as AuthenticatedUser;
    if (!authUser) return handleUnauthorized();

    // Authorization: Only owners or admins can change platform roles
    if (authUser.companyRole !== 'owner' && authUser.platformRole !== 'admin') {
      return createErrorResponse("FORBIDDEN", "Only owners or admins can change platform roles");
    }

    const { platformRole } = (await request.json()) as { platformRole: 'admin' | 'user' };

    const memberToUpdate = db.users.findFirst({
      where: { id: params.id },
    }) as TeamMember;

    if (!memberToUpdate) {
      return createErrorResponse("NOT_FOUND", `Team member with id ${params.id} not found`);
    }

    // Ensure the user being updated is in the same company
    if (memberToUpdate.companyId !== authUser.companyId) {
      return createErrorResponse("FORBIDDEN", "Forbidden");
    }

    // Prevent users from changing their own role or the owner's role
    if (memberToUpdate.id === authUser.id || memberToUpdate.companyRole === 'owner') {
      return createErrorResponse("FORBIDDEN", "Cannot change your own or owner's role");
    }

    const updatedMember = db.users.update({
      where: {
        id: params.id,
      },
      data: {
        ...memberToUpdate,
        platformRole,
      },
    });

    if (!updatedMember) {
      return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to update platform role");
    }

    return createSuccessResponse("OPERATION_SUCCESS", "teamMember", updatedMember);
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to update platform role");
  }
};

export const updateTeamMember = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const authUser = getAuthenticatedUser(request) as AuthenticatedUser;
    if (!authUser) return handleUnauthorized();

    // New check: Employees cannot edit members
    if (authUser.companyRole === 'employee') {
      return createErrorResponse("FORBIDDEN", "Employees cannot edit team members");
    }

    const body = (await request.json()) as Partial<TeamMember>;

    const memberToUpdate = db.users.findFirst({
      where: { id: params.id },
    });

    if (!memberToUpdate) {
      return createErrorResponse("NOT_FOUND", `Team member with id ${params.id} not found`);
    }

    if (memberToUpdate.companyId !== authUser.companyId) {
      return createErrorResponse("FORBIDDEN", "Forbidden");
    }

    const updatedMember = db.users.update({
      where: {
        id: params.id,
      },
      data: {
        ...memberToUpdate,
        ...body,
      },
    });

    if (!updatedMember) {
      return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to update team member");
    }

    return createSuccessResponse("OPERATION_SUCCESS", "teamMember", updatedMember);
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to update team member");
  }
};
