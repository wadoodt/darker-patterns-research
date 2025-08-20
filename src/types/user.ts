import type { User as FirebaseUser } from 'firebase/auth';
import type { FieldValue, Timestamp as FirebaseClientTimestamp } from 'firebase/firestore';

/**
 * Represents the canonical user object in the application.
 * It combines the Firebase Auth user object with the user profile data from Firestore.
 */
export interface AppUser extends FirebaseUser {
  // Authorization
  roles?: string[]; // e.g., ['researcher'] or ['admin']

  // Profile
  role?: string; // e.g., 'Principal Investigator'
  bio?: string;
  linkedinUrl?: string;

  // Timestamps
  createdAt?: FirebaseClientTimestamp | string | Date | FieldValue;
  lastLoginAt?: FirebaseClientTimestamp | string | Date | FieldValue;
}

/**
 * Defines the shape of the data that can be updated in a user's profile.
 * This is used to ensure that only specific, writable fields are passed to Firestore.
 */
export interface UserProfileUpdateData {
  displayName?: string;
  photoURL?: string;
  role?: string;
  bio?: string;
  linkedinUrl?: string;
}
