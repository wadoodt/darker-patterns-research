// src/api/mocks/user-handler.ts
import { db } from '../db';

/**
 * Handles the GET /api/profile request.
 * @returns A Response object with the user profile.
 */
export async function getProfile() {
  // There's only one profile, so findFirst is appropriate.
  const profile = db.profile.findFirst({});

  if (!profile) {
    return new Response(JSON.stringify({ message: 'Profile not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    });
  }

  return new Response(JSON.stringify(profile), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

/**
 * Handles the PATCH /api/profile request.
 * @param {Request} request - The incoming request object.
 * @returns A Response object with the updated user profile.
 */
export async function updateProfile(request: Request) {
  const { name } = await request.json();
  const updatedProfile = db.profile.update({
    where: { id: 'user-123' }, // In a real scenario, the ID might come from the URL or auth context.
    data: { name },
  });

  if (!updatedProfile) {
    return new Response(JSON.stringify({ message: 'Profile not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    });
  }

  return new Response(JSON.stringify(updatedProfile), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
