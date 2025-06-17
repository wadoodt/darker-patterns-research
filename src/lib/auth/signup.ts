import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore/mutations/users';
import type { SignupFormValues } from '@/lib/validations/signup';
import { type Auth, createUserWithEmailAndPassword, updateProfile as updateFirebaseProfile } from 'firebase/auth';

export async function createUserAccount(data: SignupFormValues) {
  const firebaseUser = await createUser(data.email, data.password);
  await createUserProfile(firebaseUser, data);

  return firebaseUser;
}

async function createUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
  const firebaseUser = userCredential.user;

  await updateFirebaseProfile(firebaseUser, {
    displayName: 'Default Display Name', // You might want to pass this as an argument
  });

  return firebaseUser;
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/email-already-in-use') {
    return 'This email address is already in use.';
  }
  return 'Failed to create account. Please try again.';
}
