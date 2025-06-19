import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore/mutations/users';
import type { SignupFormValues } from '@/lib/validations/signup';
import { type Auth, createUserWithEmailAndPassword, updateProfile as updateFirebaseProfile } from 'firebase/auth';

export async function createUserAccount(data: SignupFormValues) {
  const firebaseUser = await createUser(data.email, data.password, data.displayName);
  await createUserProfile(firebaseUser, data);

  return firebaseUser;
}

async function createUser(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
  const firebaseUser = userCredential.user;

  // Update the Firebase Auth user profile with the display name.
  await updateFirebaseProfile(firebaseUser, {
    displayName,
  });

  return firebaseUser;
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/email-already-in-use') {
    return 'This email address is already in use.';
  }
  return 'Failed to create account. Please try again.';
}
