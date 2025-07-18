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

    const company = db.companies.findFirst({ where: { id: user.companyId } });

    if (!company || company.status !== 'active') {
      const errorResponse = createErrorResponse('FORBIDDEN', { detail: 'Company account is not active.' });
      return new Response(JSON.stringify(errorResponse), {
        status: ERROR_CODES.FORBIDDEN.status,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userResponse } = {
      ...user,
      plan: company.plan,
    };
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
 * Handles the logout request using the standardized API response format.
 */
/**
 * Handles the signup request.
 */
export const signup = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();
    const { action, username, email, password } = body;

    if (action === 'create') {
      const { plan, companyName } = body;
      if (!username || !email || !password || !plan || !companyName) {
        return new Response(JSON.stringify(createErrorResponse('VALIDATION_ERROR', { error: 'All fields for creating a company are required' })), {
          status: ERROR_CODES.VALIDATION_ERROR.status,
        });
      }

      const newCompany = db.companies.create({
        name: companyName,
        plan: plan,
        status: 'active',
        stripeCustomerId: `cus_mock_${Date.now()}`,
      });

      db.users.create({
        name: username,
        username,
        email,
        password, // In a real app, hash this password
        companyId: newCompany.id,
        role: 'admin',
        status: 'active',
      });

      // For paid plans, return a mock Stripe URL. For free, return nothing.
      const responseData = plan !== 'Free' ? { stripeUrl: 'https://buy.stripe.com/test_mock_session' } : {};
      const successResponse = createSuccessResponse(responseData, 'SIGNUP_SUCCESS');
      return new Response(JSON.stringify(successResponse), { status: RESPONSE_CODES.SIGNUP_SUCCESS.status });

    } else if (action === 'join') {
      const { companyId } = body;
      if (!username || !email || !password || !companyId) {
        return new Response(JSON.stringify(createErrorResponse('VALIDATION_ERROR', { error: 'All fields for joining a company are required' })), {
          status: ERROR_CODES.VALIDATION_ERROR.status,
        });
      }

      const company = db.companies.findFirst({ where: { id: companyId } });
      if (!company || company.status !== 'active') {
        return new Response(JSON.stringify(createErrorResponse('NOT_FOUND', { detail: 'The specified Company ID is invalid or the company is not active.' })), {
          status: ERROR_CODES.NOT_FOUND.status,
        });
      }

      db.users.create({
        name: username,
        username,
        email,
        password, // In a real app, hash this password
        companyId: company.id,
        role: 'user',
        status: 'created', // User needs approval or is pending
      });

      const successResponse = createSuccessResponse({}, 'SIGNUP_SUCCESS');
      return new Response(JSON.stringify(successResponse), { status: RESPONSE_CODES.SIGNUP_SUCCESS.status });

    } else {
      return new Response(JSON.stringify(createErrorResponse('VALIDATION_ERROR', { error: 'Invalid signup action specified' })), {
        status: ERROR_CODES.VALIDATION_ERROR.status,
      });
    }
  } catch {
    const errorResponse = createErrorResponse('INTERNAL_SERVER_ERROR');
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
    });
  }
};

export const logout = async (): Promise<Response> => {
  const successResponse = createSuccessResponse(null, 'OPERATION_SUCCESS');
  return new Response(JSON.stringify(successResponse), {
    status: RESPONSE_CODES.OPERATION_SUCCESS.status,
  });
};
