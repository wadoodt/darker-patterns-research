import { Timestamp } from 'firebase/firestore';

export interface UserDataFromFirestore {
  uid: string;
  email?: string | null;
  roles?: string[];
  createdAt?: Timestamp | Date;
  lastLoginAt?: Timestamp | Date;
  displayName?: string | null;
  photoURL?: string | null;
}
