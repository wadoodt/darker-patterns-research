import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { Auth, signInWithEmailAndPassword } from 'firebase/auth';

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth as Auth, email, password);
}

export function getLoginErrorMessage(error: FirebaseError): string {
  if (
    error.code === 'auth/user-not-found' ||
    error.code === 'auth/wrong-password' ||
    error.code === 'auth/invalid-credential'
  ) {
    return 'Invalid email or password. Please try again.';
  }
  if (error.code === 'auth/too-many-requests') {
    return 'Access temporarily disabled due to too many failed login attempts. Please try again later.';
  }
  return 'An unexpected error occurred. Please try again.';
}
