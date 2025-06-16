// Firestore survey-related queries
// Move survey query functions here from src/lib/survey/database.ts

import { db } from '@/lib/firebase';
import type { DPOEntry } from '@/types/dpo';
import { collection, Firestore, getDocs, limit, orderBy, query } from 'firebase/firestore';

export async function generateDummyEntries(count: number): Promise<DPOEntry[]> {
  return Array.from({ length: count }).map((_, i) => ({
    id: `dummyEntry${i + 1}-${crypto.randomUUID().substring(0, 4)}`,
    instruction: `This is the primary instruction for dummy DPO entry ${i + 1}. Analyze based on the prompt provided.`,
    prompt: `Original prompt example for entry ${i + 1}: "Explain quantum entanglement simply."`,
    acceptedResponse: `Response A for dummy entry ${i + 1}: (Better response with simpler language and clearer examples)`,
    rejectedResponse: `Response B for dummy entry ${i + 1}: (Less ideal response with potential dark patterns)`,
    category: i % 3 === 0 ? 'Obscuring Information' : i % 3 === 1 ? 'Misleading Content' : 'Privacy Harm',
    discussion: `Expert discussion for entry ${i + 1}, explaining the rationale for the preferred response.`,
    reviewCount: Math.floor(Math.random() * 5),
  }));
}

export async function fetchAndAssignEntries(count: number): Promise<DPOEntry[]> {
  if (!db) {
    throw new Error('Firebase is not initialized. Ensure your environment configuration is correct.');
  }
  try {
    const entriesCollectionRef = collection(db as Firestore, 'dpo_entries');
    const q = query(entriesCollectionRef, orderBy('reviewCount', 'asc'), limit(count));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.warn('No DPO entries found in the database. Returning an empty array.');
      return generateDummyEntries(count);
    }
    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DPOEntry[];
    return entries;
  } catch (error) {
    console.error('Error fetching DPO entries:', error);
    throw new Error('Failed to fetch DPO entries from the database.');
  }
}
