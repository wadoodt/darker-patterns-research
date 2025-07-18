import { db } from '../db';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../../response';
import { ERROR_CODES } from '../../codes';
import type { User } from 'types/api';

/**
 * Handles the request to get all users within the admin's company.
 */
export const getUsers = async (): Promise<Response> => {
  // MOCK: Simulate an authenticated admin user for authorization.
  // In a real app, this would come from the session/token.
  const mockAdminUser = db.users.findFirst({ where: { role: 'admin' } });

  if (!mockAdminUser) {
    const errorResponse = createErrorResponse('UNAUTHORIZED', { detail: 'No admin user found in mock DB.'});
    return new Response(JSON.stringify(errorResponse), { status: ERROR_CODES.UNAUTHORIZED.status });
  }

  const usersInCompany = db.users.findMany({ where: { companyId: mockAdminUser.companyId } });
  
  // Exclude password from the response
  const usersResponse = usersInCompany.map(user => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  });

  const response = createSuccessResponse({ users: usersResponse }, 'OPERATION_SUCCESS');
  return new Response(JSON.stringify(response));
};

/**
 * Handles the request to update a user's role or status.
 */
export const updateUser = async (request: Request): Promise<Response> => {
  const mockAdminUser = db.users.findFirst({ where: { role: 'admin' } });
  if (!mockAdminUser) {
    const errorResponse = createErrorResponse('UNAUTHORIZED', { detail: 'No admin user found in mock DB.'});
    return new Response(JSON.stringify(errorResponse), { status: ERROR_CODES.UNAUTHORIZED.status });
  }

  const url = new URL(request.url);
  const userId = url.pathname.split('/').pop();
  const { role, status } = (await request.json()) as Partial<
    Pick<User, 'role' | 'status'>
  >;

  if (!userId) {
    const errorResponse = createErrorResponse('VALIDATION_ERROR', { error: 'User ID is missing from the URL.' });
    return new Response(JSON.stringify(errorResponse), { status: ERROR_CODES.VALIDATION_ERROR.status });
  }

  const userToUpdate = db.users.findFirst({ where: { id: userId } });

  if (!userToUpdate) {
    const errorResponse = createErrorResponse('NOT_FOUND', { detail: 'User to update was not found.' });
    return new Response(JSON.stringify(errorResponse), { status: ERROR_CODES.NOT_FOUND.status });
  }

  // Authorization check: ensure the admin is updating a user in their own company
  if (userToUpdate.companyId !== mockAdminUser.companyId) {
    const errorResponse = createErrorResponse('FORBIDDEN', { detail: 'You can only update users in your own company.' });
    return new Response(JSON.stringify(errorResponse), { status: ERROR_CODES.FORBIDDEN.status });
  }

  const updatedUser = db.users.update({
    where: { id: userId },
    data: {
      ...(role && { role }),
      ...(status && { status }),
    },
  });

  if (!updatedUser) {
    // This case should theoretically not be reached if userToUpdate was found, but it's good practice
    const errorResponse = createErrorResponse('INTERNAL_SERVER_ERROR', { detail: 'Failed to update the user.' });
    return new Response(JSON.stringify(errorResponse), { status: ERROR_CODES.INTERNAL_SERVER_ERROR.status });
  }

  // Exclude password from the response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userResponse } = updatedUser;

  const response = createSuccessResponse(userResponse, 'OPERATION_SUCCESS');
  return new Response(JSON.stringify(response));
};
