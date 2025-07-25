import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
import type { User, NewTeamMember } from "types/api/user";
import { mockUsers } from "../_data/user-data";
import { mockCompanies } from "../_data/companies-data";

// Helper function to get team members
const fetchTeamMembers = (companyId: string): User[] => {
  const company = mockCompanies.find(c => c.id === companyId);
  if (!company) return [];
  
  return mockUsers.filter(user => 
    user.companyId === companyId && 
    user.companyRole && 
    user.status === "active"
  );
};

// In a real app, these would come from the authenticated user's session
const CURRENT_COMPANY_ID = "comp-123";

export const createTeamMember = async (
  request: Request
): Promise<Response> => {
  try {
    const { name, email, companyRole } = (await request.json()) as NewTeamMember;

    if (!name || !email || !companyRole) {
      const errorResponse = createErrorResponse("VALIDATION_ERROR", {
        message: "Missing required fields",
      });
      return new Response(JSON.stringify(errorResponse), { status: 400 });
    }

    // In a real app, we'd check if a user with this email already exists.
    // If so, we'd invite them. If not, we'd create a new user record.
    // For this mock, we'll create a new record every time.

    const newMember: User = {
      id: crypto.randomUUID(),
      name,
      email,
      username: email.split('@')[0], // Create a username from the email
      platformRole: "user", // Invited members are always standard users
      companyId: CURRENT_COMPANY_ID,
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

export const getTeamMembersHandler = async (): Promise<Response> => {
  try {
    const members = fetchTeamMembers(CURRENT_COMPANY_ID);
    const response = createSuccessResponse(members, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), { status: 200 });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to fetch team members",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
};

export const getTeamMembers = (request: Request): Response => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const allMembers = db.users.findMany({});
  const totalMembers = allMembers.length;
  const totalPages = Math.ceil(totalMembers / limit);
  const data = allMembers.slice((page - 1) * limit, page * limit);

  const response = createSuccessResponse(
    {
      members: data,
      pagination: {
        total: totalMembers,
        totalPages,
        page,
        limit,
      },
    },
    "OPERATION_SUCCESS"
  );

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteTeamMember = async (
  _request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const { id } = params;
    const member = db.users.findFirst({
      where: { id: id },
    });

    if (!member) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: `Team member with id ${id} not found`,
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
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

export const updateTeamMember = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const body = (await request.json()) as Partial<User>;

    const member = db.users.findFirst({
      where: { id: params.id },
    });

    if (!member) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: `Team member with id ${params.id} not found`,
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    const updatedMember = db.users.update({
      where: {
        id: params.id,
      },
      data: {
        ...member,
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
