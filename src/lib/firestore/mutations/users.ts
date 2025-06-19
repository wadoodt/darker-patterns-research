// src/lib/firestore/mutations/users.ts
import { db } from '@/lib/firebase';
import type { SignupFormValues } from '@/lib/validations/signup';
import type { AppUser } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, Firestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Creates a new user profile document in Firestore after signup.
 * This document stores user data that is not managed by Firebase Auth.
 */
export async function createUserProfile(firebaseUser: FirebaseUser, data: SignupFormValues) {
  const userProfileData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: data.displayName,
    photoURL: firebaseUser.photoURL,
    roles: data.isResearcher ? ['researcher'] : [],
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
  await setDoc(doc(db as Firestore, 'users', firebaseUser.uid), userProfileData);
}

/**
 * Updates an existing user profile document in Firestore.
 */
export async function updateUserProfile(uid: string, data: Partial<AppUser>) {
  const userDocRef = doc(db as Firestore, 'users', uid);
  await updateDoc(userDocRef, data);
}
