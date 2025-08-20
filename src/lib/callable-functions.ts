import { getFunctions, httpsCallable } from 'firebase/functions';
import type { EntryWithDetails } from '@/types/entryDetails';

// This ensures the code only runs on the client side
const isClient = typeof window !== 'undefined';

let functions: ReturnType<typeof getFunctions> | null = null;
let getEntryDetailsCallable: ReturnType<
  typeof httpsCallable<{ entryId: string }, { entryDetails: EntryWithDetails }>
> | null = null;

if (isClient) {
  try {
    // Initialize Firebase Functions only on the client side
    functions = getFunctions();
    getEntryDetailsCallable = httpsCallable<{ entryId: string }, { entryDetails: EntryWithDetails }>(
      functions,
      'getEntryDetails',
    );
  } catch (error) {
    console.error('Failed to initialize Firebase Functions:', error);
  }
}

/**
 * Fetches the full details for a given DPO entry, including evaluations and analytics.
 * This function calls the `getEntryDetails` Cloud Function.
 * @param entryId The ID of the DPO entry to fetch.
 * @returns A promise that resolves to the detailed entry data.
 */
export async function getEntryDetails(entryId: string): Promise<EntryWithDetails> {
  if (!isClient || !getEntryDetailsCallable) {
    // Return a rejected promise with a meaningful error message
    throw new Error('Firebase Functions are not available in this environment');
  }

  try {
    const result = await getEntryDetailsCallable({ entryId });
    // The callable function returns a data object with the entryDetails property.
    return (result.data as { entryDetails: EntryWithDetails }).entryDetails;
  } catch (error) {
    console.error('Error calling getEntryDetails function:', error);
    // Re-throw the error to be handled by the calling component
    throw new Error('Failed to fetch entry details.');
  }
}
