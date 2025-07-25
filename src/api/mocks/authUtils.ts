import { db } from "./db";
import { createErrorResponse } from "../response";
import type { User } from "../../types/api/user";

export const getAuthenticatedUser = (request: Request): User | null => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return null;
  }

  const userId = token.replace("mock-token-for-id-", "");
  const user = db.users.findFirst({ where: { id: userId } });

  return user || null;
};

export const handleUnauthorized = (): Response => {
  return new Response(JSON.stringify(createErrorResponse("UNAUTHORIZED")), {
    status: 401,
  });
};
