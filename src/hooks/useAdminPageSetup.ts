'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { toast } from 'sonner';
import { db, functions } from '@/lib/firebase';

export function useAdminPageSetup() {
  const [defaultTargetReviews, setDefaultTargetReviews] = useState(10);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isIngestModalOpen, setIngestModalOpen] = useState(false);
  const [needsRefetch, setNeedsRefetch] = useState(false);

  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const fetchInitialSetupData = async () => {
      if (isDev || !db) {
        setInitialDataLoading(false);
        if (!db) console.error('Firebase db is not initialized.');
        return;
      }

      setInitialDataLoading(true);
      try {
        const settingsDocSnap = await getDoc(doc(db, 'admin_settings', 'global_config'));
        if (settingsDocSnap.exists()) {
          setDefaultTargetReviews(settingsDocSnap.data().minTargetReviewsPerEntry || 10);
        }
      } catch (err) {
        console.error('Error fetching initial setup data for entries page:', err);
        toast.error('Failed to load admin settings.');
      } finally {
        setInitialDataLoading(false);
      }
    };

    fetchInitialSetupData();
  }, [isDev]);

  const handleIngestSubmit = async (fileContent: string) => {
    if (!functions) {
      toast.error('Firebase Functions is not initialized.');
      return;
    }
    setIsIngesting(true);
    const ingestDpoDataset = httpsCallable(functions, 'ingestDpoDataset');

    try {
      const data = JSON.parse(fileContent);
      const result = (await ingestDpoDataset(data)) as { data: { success: boolean; message: string } };

      if (result.data.success) {
        toast.success(result.data.message);
        setNeedsRefetch(true);
      } else {
        toast.error(result.data.message || 'Ingestion failed. Please check the logs.');
      }
    } catch (error) {
      console.error('Error ingesting dataset:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during ingestion.';
      toast.error(errorMessage);
    } finally {
      setIsIngesting(false);
      setIngestModalOpen(false);
    }
  };

  return {
    defaultTargetReviews,
    initialDataLoading,
    isIngesting,
    isIngestModalOpen,
    setIngestModalOpen,
    handleIngestSubmit,
    needsRefetch,
    setNeedsRefetch,
  };
}
