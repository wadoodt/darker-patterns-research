'use client';

import { functions } from '@/lib/firebase';
import { getAdminSettings } from '@/lib/firestore/queries/admin';
import { ingestDpoDataset } from '@/lib/firestore/mutations/admin';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useAdminPageSetup() {
  const [defaultTargetReviews, setDefaultTargetReviews] = useState(10);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isIngestModalOpen, setIngestModalOpen] = useState(false);
  const [needsRefetch, setNeedsRefetch] = useState(false);

  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const fetchInitialSetupData = async () => {
      if (isDev) {
        setInitialDataLoading(false);
        return;
      }

      setInitialDataLoading(true);
      try {
        const settings = await getAdminSettings();
        if (settings.minTargetReviewsPerEntry) {
          setDefaultTargetReviews(settings.minTargetReviewsPerEntry);
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

    try {
      const { success, message } = await ingestDpoDataset(fileContent);

      if (success) {
        toast.success(message);
        setNeedsRefetch(true);
      } else {
        toast.error(message || 'Ingestion failed. Please check the logs.');
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
