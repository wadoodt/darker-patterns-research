import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
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
      const errorResponse = createErrorResponse("VALIDATION_ERROR", {
        message: "Missing required fields",
      });
      return new Response(JSON.stringify(errorResponse), { status: 400 });
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

    const response = createSuccessResponse(newMember, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to create team member",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
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
  // if length is zero retunr empty HTTP code, can use 200 but different message
  if (totalMembers === 0) {
    const response = createSuccessResponse(
      {
        members: [],
        totalMembers: 0,
        totalPages: 0,
        currentPage: 0,
        limit: 0,
      },
      "NO_DATA"
    );
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const totalPages = Math.ceil(totalMembers / limit);
  const data = allMembers.slice((page - 1) * limit, page * limit);

  const response = createSuccessResponse(
    {
      members: data,
      totalMembers,
      totalPages,
      currentPage: page,
      limit,
    },
    "OPERATION_SUCCESS"
  );

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
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
      return new Response(JSON.stringify(createErrorResponse("FORBIDDEN", {
        message: "Managers cannot delete team members"
      })), {
        status: 403,
      });
    }

    const { id } = params;
    const memberToDelete = db.users.findFirst({
      where: { id: id },
    });

    if (!memberToDelete) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: `Team member with id ${id} not found`,
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    if (memberToDelete.companyId !== authUser.companyId) {
      return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
        status: 403,
      });
    }

    db.users.delete({ where: { id: id } });

    const response = createSuccessResponse({}, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to delete team member",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
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
      return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
        status: 403,
      });
    }

    const { platformRole } = (await request.json()) as { platformRole: 'admin' | 'user' };

    const memberToUpdate = db.users.findFirst({
      where: { id: params.id },
    }) as TeamMember;

    if (!memberToUpdate) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: `Team member with id ${params.id} not found`,
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    // Ensure the user being updated is in the same company
    if (memberToUpdate.companyId !== authUser.companyId) {
      return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
        status: 403,
      });
    }

    // Prevent users from changing their own role or the owner's role
    if (memberToUpdate.id === authUser.id || memberToUpdate.companyRole === 'owner') {
        return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
            status: 403,
        });
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
      const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
        message: "Failed to update platform role",
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
      });
    }

    const response = createSuccessResponse(updatedMember, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to update platform role",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
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
      return new Response(JSON.stringify(createErrorResponse("FORBIDDEN", {
        message: "Employees cannot edit team members"
      })), {
        status: 403,
      });
    }

    const body = (await request.json()) as Partial<TeamMember>;

    const memberToUpdate = db.users.findFirst({
      where: { id: params.id },
    });

    if (!memberToUpdate) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: `Team member with id ${params.id} not found`,
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    if (memberToUpdate.companyId !== authUser.companyId) {
      return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
        status: 403,
      });
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
      const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
        message: "Failed to update team member",
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
      });
    }

    const response = createSuccessResponse(updatedMember, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to update team member",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
};
