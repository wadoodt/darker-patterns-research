import type { UserDataFromFirestore } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, Firestore, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

export async function fetchOrCreateUserProfile(
  db: Firestore,
  firebaseUser: FirebaseUser,
): Promise<UserDataFromFirestore> {
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
    updateDoc(userDocRef, { lastLoginAt: serverTimestamp() }).catch(console.error);
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
