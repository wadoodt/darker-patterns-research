// src/lib/firestore/mutations/users.ts
import { db } from '@/lib/firebase';
import type { SignupFormValues } from '@/lib/validations/signup';
import type { UserDataFromFirestore } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, Firestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

export async function createUserProfile(firebaseUser: FirebaseUser, data: SignupFormValues) {
  await setDoc(doc(db as Firestore, 'users', firebaseUser.uid), {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: data.displayName,
    isResearcher: data.isResearcher || false,
    createdAt: serverTimestamp(),
  });
}

export async function updateUserProfile(uid: string, data: Partial<UserDataFromFirestore>) {
  const userDocRef = doc(db as Firestore, 'users', uid);
  await updateDoc(userDocRef, data);
}
