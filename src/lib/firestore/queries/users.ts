// src/lib/firestore/queries/users.ts
import { db } from '@/lib/firebase';
import type { UserDataFromFirestore } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function fetchOrCreateUserProfile(firebaseUser: FirebaseUser): Promise<UserDataFromFirestore> {
  if (!db) throw new Error('Firebase is not initialized');
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const fetchedUserData = userDocSnap.data() as UserDataFromFirestore;
    const combinedProfile: UserDataFromFirestore = {
      ...fetchedUserData,
      uid: firebaseUser.uid,
      email: firebaseUser.email || fetchedUserData.email,
      displayName: firebaseUser.displayName || fetchedUserData.displayName,
      photoURL: firebaseUser.photoURL || fetchedUserData.photoURL,
    };
    // Update last login timestamp
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true }).catch(console.error);
    return combinedProfile;
  } else {
    const newProfileData: UserDataFromFirestore = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      roles: ['researcher'],
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
      photoURL: firebaseUser.photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newProfileData);
    return newProfileData;
  }
}
