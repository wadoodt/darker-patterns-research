import type { User as FirebaseUser } from 'firebase/auth';
import type { FieldValue, Timestamp as FirebaseClientTimestamp } from 'firebase/firestore';

/**
 * Represents the canonical user object in the application.
 * It combines the Firebase Auth user object with the user profile data from Firestore.
 */
export interface AppUser extends FirebaseUser {
  roles?: string[]; // e.g., ['researcher'] or ['admin']
  createdAt?: FirebaseClientTimestamp | string | Date | FieldValue;
  lastLoginAt?: FirebaseClientTimestamp | string | Date | FieldValue;
}
