// src/components/landing/types.ts
import type { Timestamp } from 'firebase/firestore';

export interface LandingUpdate {
  id: string;
  title: string;
  date: Timestamp | { seconds: number; nanoseconds: number };
  description: string;
  iconName?: string;
}
