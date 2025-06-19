// src/lib/firestore/queries/users.ts
import { db } from '@/lib/firebase';
import type { AppUser } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function fetchOrCreateUserProfile(firebaseUser: FirebaseUser): Promise<AppUser> {
  if (!db) throw new Error('Firebase is not initialized');
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const firestoreData = userDocSnap.data();
    // Combine the Firebase Auth user object with Firestore data.
    const appUser: AppUser = {
      ...firebaseUser,
      ...firestoreData,
    };
    // Update last login timestamp in the background.
    setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true }).catch(console.error);
    return appUser;
  } else {
    // For a new user, create the profile data to be stored in Firestore.
    const newProfileData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      roles: ['researcher'], // Default role.
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newProfileData);

    // The final AppUser object combines the full FirebaseUser object with the new data.
    const appUser: AppUser = {
      ...firebaseUser,
      roles: newProfileData.roles,
      createdAt: newProfileData.createdAt,
      lastLoginAt: newProfileData.lastLoginAt,
    };
    return appUser;
  }
}
