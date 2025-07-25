import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
import type { TeamMember, NewTeamMember } from "../../../types/api";

export const createTeamMember = async (
  request: Request
): Promise<Response> => {
  try {
    const { name, email, role } = (await request.json()) as NewTeamMember;

    // Basic validation
    if (!name || !email || !role) {
      const errorResponse = createErrorResponse("VALIDATION_ERROR", {
        message: "Missing required fields",
      });
      return new Response(JSON.stringify(errorResponse), { status: 400 });
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      status: "invited",
      lastActive: "-",
    };

    db.teamMembers.create(newMember);

    const response = createSuccessResponse(newMember, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "An unexpected error occurred",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const getTeamMembers = (request: Request): Response => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const allMembers = db.teamMembers.findMany({});
  const totalMembers = allMembers.length;
  const totalPages = Math.ceil(totalMembers / limit);
  const data = allMembers.slice((page - 1) * limit, page * limit);

  const response = createSuccessResponse(
    {
      members: data,
      totalPages,
      currentPage: page,
      totalMembers,
    },
    "OPERATION_SUCCESS"
  );

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteTeamMember = async (
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    const { id } = params;
    const member = db.teamMembers.findFirst({
      where: { id: id },
    });

    if (!member) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: "Member not found",
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    db.teamMembers.delete({ where: { id: id } });

    const response = createSuccessResponse({}, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "An unexpected error occurred",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const updateTeamMember = async (
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    const { id } = params;
    const body = (await request.json()) as Partial<TeamMember>;

    const member = db.teamMembers.findFirst({
      where: { id: id },
    });

    if (!member) {
      const errorResponse = createErrorResponse(
        "NOT_FOUND",
        { message: "Member not found" }
      );
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedMember = db.teamMembers.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });

    const response = createSuccessResponse(updatedMember, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const errorResponse = createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      { message: "An unexpected error occurred" }
    );
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
