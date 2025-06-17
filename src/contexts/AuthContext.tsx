'use client';

import { auth, db } from '@/lib/firebase';
import { fetchOrCreateUserProfile } from '@/lib/firestore/queries/users';
import { UserDataFromFirestore } from '@/types/user';
import { Firestore } from '@google-cloud/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: FirebaseUser | null; // Firebase Auth user object
  profile: UserDataFromFirestore | null; // Combined/enriched user profile from Firestore
  isAdmin: boolean;
  isResearcher: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getMockAuthState() {
  const mockUser = {
    uid: 'test-user-uid',
    email: 'test@example.com',
    displayName: 'Test Admin User',
  } as FirebaseUser;
  const mockProfile: UserDataFromFirestore = {
    uid: 'test-user-uid',
    email: 'test@example.com',
    displayName: 'Test Admin User',
    roles: ['admin', 'researcher'],
    photoURL: 'https://placehold.co/100x100.png',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  return { mockUser, mockProfile };
}

function getRoleFlags(roles: string[] | undefined) {
  const isAdmin = !!roles?.includes('admin');
  const isResearcher = !!roles?.includes('researcher') || isAdmin;
  return { isAdmin, isResearcher };
}

async function handleAuthState(
  firebaseUser: FirebaseUser | null,
  db: Firestore,
  setUser: (u: FirebaseUser | null) => void,
  setProfile: (p: UserDataFromFirestore | null) => void,
  setIsAdmin: (b: boolean) => void,
  setIsResearcher: (b: boolean) => void,
  setLoading: (b: boolean) => void,
) {
  setLoading(true);
  setUser(firebaseUser);
  if (firebaseUser) {
    try {
      const combinedProfile = await fetchOrCreateUserProfile(firebaseUser);
      setProfile(combinedProfile);
      const { isAdmin, isResearcher } = getRoleFlags(combinedProfile.roles);
      setIsAdmin(isAdmin);
      setIsResearcher(isResearcher);
    } catch (fetchError) {
      console.error('Error fetching/creating user document in Firestore:', fetchError);
      setProfile(null);
      setIsAdmin(false);
      setIsResearcher(false);
    }
  } else {
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setIsResearcher(false);
  }
  setLoading(false);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserDataFromFirestore | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isResearcher, setIsResearcher] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      const { mockUser, mockProfile } = getMockAuthState();
      setUser(mockUser);
      setProfile(mockProfile);
      setIsAdmin(true);
      setIsResearcher(true);
      setLoading(false);
      return;
    }

    if (!auth || !db) {
      console.warn('AuthContext: Firebase auth or db is not initialized. Skipping auth state listener.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) =>
      handleAuthState(
        firebaseUser,
        db as unknown as Firestore,
        setUser,
        setProfile,
        setIsAdmin,
        setIsResearcher,
        setLoading,
      ),
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (process.env.NODE_ENV === 'test') {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setIsResearcher(false);
      setLoading(false);
      return;
    }
    if (!auth) {
      console.warn('AuthContext: Firebase auth is not initialized. Cannot logout.');
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      // Explicitly typed error
      console.error('Error signing out: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isResearcher, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
