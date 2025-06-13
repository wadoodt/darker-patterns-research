import { type FieldValue, type Timestamp as FirebaseClientTimestamp } from 'firebase/firestore';

export interface UserDataFromFirestore {
  // Structure of your /users/{uid} document
  uid: string;
  email?: string | null;
  roles?: string[]; // e.g., ['researcher'] or ['admin']
  createdAt?: FirebaseClientTimestamp | string | Date | FieldValue; // Firestore Timestamp (client), ISO string, Date, or FieldValue
  lastLoginAt?: FirebaseClientTimestamp | string | Date | FieldValue; // Firestore Timestamp (client), ISO string, Date, or FieldValue
  displayName?: string | null; // User's display name
  photoURL?: string | null;
}
