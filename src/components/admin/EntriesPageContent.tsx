'use client';
import { useAdminEntries } from '@/hooks/useAdminEntries';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { getMockDpoEntries } from '@/lib/firestore/mocks/admin';
import { HARM_CATEGORIES } from '@/lib/harm-categories';
import { doc, getDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { EntriesPageView } from './EntriesPageView';

export default function EntriesPageContent() {
  const categories = HARM_CATEGORIES.map((c) => c.name);
  const [defaultTargetReviews, setDefaultTargetReviews] = useState(10);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const { isAdmin } = useAuth();

  const isDev = process.env.NODE_ENV === 'development';

  // Always call the hook, but override values in dev
  const adminEntries = useAdminEntries(defaultTargetReviews);
  const mockEntries = useCallback(() => getMockDpoEntries(10), []);

  useEffect(() => {
    const fetchInitialSetupData = async () => {
      setInitialDataLoading(true);
      if (!db) {
        console.error('EntriesPageContent: Firebase db is not initialized.');
        setInitialDataLoading(false);
        return;
      }
      try {
        const settingsDocSnap = await getDoc(doc(db, 'admin_settings', 'global_config'));
        if (settingsDocSnap.exists()) {
          setDefaultTargetReviews(settingsDocSnap.data().minTargetReviewsPerEntry || 10);
        }
      } catch (err) {
        console.error('Error fetching initial setup data for entries page:', err);
      } finally {
        setInitialDataLoading(false);
      }
    };

    if (!isDev) {
      fetchInitialSetupData();
    } else {
      console.warn('Using mock data in development mode. Default reviews will be set manually.');
      setInitialDataLoading(false);
    }
  }, [isDev]);

  // Use mock data in dev, otherwise use real data
  const entries = isDev ? mockEntries() : adminEntries.entries;
  const isLoadingEntries = isDev ? false : adminEntries.isLoading;
  const error = isDev ? null : adminEntries.error;
  const currentPage = isDev ? 1 : adminEntries.currentPage;
  const totalEntriesCount = isDev ? mockEntries.length : adminEntries.totalEntriesCount;
  const ITEMS_PER_PAGE = isDev ? 20 : adminEntries.ITEMS_PER_PAGE;
  const activeFilters = isDev ? {} : adminEntries.activeFilters;
  const sortConfig: { key: 'id'; direction: 'asc' } | typeof adminEntries.sortConfig = isDev
    ? { key: 'id', direction: 'asc' }
    : adminEntries.sortConfig;
  const handleFilterChange = isDev ? () => {} : adminEntries.handleFilterChange;
  const handleSortChange = isDev ? () => {} : adminEntries.handleSortChange;
  const handlePageChange = isDev ? () => {} : adminEntries.handlePageChange;

  const handleIngestDataset = () => {
    alert(
      'Admin Action: Dataset ingestion functionality to be implemented. This would typically involve uploading a JSON file or triggering a Firebase Function.',
    );
  };

  const handleAddNewEntry = () => {
    alert("Admin Action: 'Add New DPO Entry' functionality to be implemented.");
  };

  return (
    <EntriesPageView
      isAdmin={isAdmin}
      initialDataLoading={initialDataLoading}
      isLoadingEntries={isLoadingEntries}
      error={error}
      entries={entries}
      totalEntriesCount={totalEntriesCount}
      currentPage={currentPage}
      ITEMS_PER_PAGE={ITEMS_PER_PAGE}
      categories={categories}
      activeFilters={activeFilters}
      sortConfig={sortConfig}
      handleAddNewEntry={handleAddNewEntry}
      handleIngestDataset={handleIngestDataset}
      handleFilterChange={handleFilterChange}
      handleSortChange={handleSortChange}
      handlePageChange={handlePageChange}
    />
  );
}
