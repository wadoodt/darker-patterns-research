import { db } from '../db';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../../response';
import { ERROR_CODES, RESPONSE_CODES } from '../../codes';

/**
 * Handles the login request using the standardized API response format.
 */
export const login = async (request: Request): Promise<Response> => {
  try {
    const { username, password } = await request.json();
    const user = db.users.findFirst({ where: { username } });

    if (!user || user.password !== password) {
      const errorResponse = createErrorResponse('INVALID_CREDENTIALS');
      return new Response(JSON.stringify(errorResponse), {
        status: ERROR_CODES.INVALID_CREDENTIALS.status,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userResponse } = user;
    const token = `mock-token-for-id-${user.id}`;

    const successResponse = createSuccessResponse(
      {
        user: userResponse,
        token,
        expiresIn: 86400,
      },
      'LOGIN_SUCCESS'
    );

    return new Response(JSON.stringify(successResponse), {
      status: RESPONSE_CODES.LOGIN_SUCCESS.status,
    });
  } catch {
    const errorResponse = createErrorResponse('INTERNAL_SERVER_ERROR');
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
    });
  }
};

/**
 * Handles the 'me' request using the standardized API response format.
 */
export const me = async (request: Request): Promise<Response> => {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      const errorResponse = createErrorResponse('UNAUTHORIZED');
      return new Response(JSON.stringify(errorResponse), {
        status: ERROR_CODES.UNAUTHORIZED.status,
      });
    }

    const userId = token.replace('mock-token-for-id-', '');
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      const errorResponse = createErrorResponse('UNAUTHORIZED');
      return new Response(JSON.stringify(errorResponse), {
        status: ERROR_CODES.UNAUTHORIZED.status,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    const successResponse = createSuccessResponse(
      { user: userResponse },
      'OPERATION_SUCCESS'
    );

    return new Response(JSON.stringify(successResponse), {
      status: RESPONSE_CODES.OPERATION_SUCCESS.status,
    });
  } catch {
    const errorResponse = createErrorResponse('INTERNAL_SERVER_ERROR');
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
    });
  }
};

/**
 * Handles the logout request using the standardized API response format.
 */
export const logout = async (): Promise<Response> => {
  const successResponse = createSuccessResponse(null, 'OPERATION_SUCCESS');
  return new Response(JSON.stringify(successResponse), {
    status: RESPONSE_CODES.OPERATION_SUCCESS.status,
  });
};
