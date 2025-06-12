import { auth, db } from '@/lib/firebase';
import type { SignupFormValues } from '@/lib/validations/signup';
import { Auth, createUserWithEmailAndPassword, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore';

export async function createUserAccount(data: SignupFormValues) {
  const userCredential = await createUserWithEmailAndPassword(auth as Auth, data.email, data.password);
  const firebaseUser = userCredential.user;

  await updateFirebaseProfile(firebaseUser, {
    displayName: data.displayName,
  });

  await setDoc(doc(db as Firestore, 'users', firebaseUser.uid), {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: data.displayName,
    isResearcher: data.isResearcher || false,
    createdAt: new Date().toISOString(),
  });

  return firebaseUser;
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/email-already-in-use') {
    return 'This email address is already in use.';
  }
  return 'Failed to create account. Please try again.';
}
