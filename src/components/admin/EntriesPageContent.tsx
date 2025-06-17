'use client';

import { AdminEntriesFilter, AdminEntriesSortConfig, useAdminEntries } from '@/hooks/useAdminEntries';
import { useAdminPageSetup } from '@/hooks/useAdminPageSetup';
import { useAuth } from '@/hooks/useAuth';
import { getMockDpoEntries } from '@/lib/firestore/mocks/admin';
import { HARM_CATEGORIES } from '@/lib/harm-categories';
import { useCallback, useEffect } from 'react';
import { IngestDatasetModal } from './IngestDatasetModal';
import { EntriesPageView } from './EntriesPageView';

export default function EntriesPageContent() {
  const { isAdmin } = useAuth();
  const isDev = process.env.NODE_ENV === 'development';
  const categories = HARM_CATEGORIES.map((c) => c.name);
  const mockEntries = useCallback(() => getMockDpoEntries(10), []);

  const {
    defaultTargetReviews,
    initialDataLoading,
    isIngesting,
    isIngestModalOpen,
    setIngestModalOpen,
    handleIngestSubmit,
    needsRefetch,
    setNeedsRefetch,
  } = useAdminPageSetup();

  const { refetchEntries, ...adminEntries } = useAdminEntries(defaultTargetReviews);

  useEffect(() => {
    if (needsRefetch && refetchEntries) {
      refetchEntries();
      setNeedsRefetch(false);
    }
  }, [needsRefetch, refetchEntries, setNeedsRefetch]);

  // Use mock data in dev, otherwise use real data
  const entries = isDev ? mockEntries() : adminEntries.entries;
  const isLoadingEntries = isDev ? false : adminEntries.isLoading;
  const error = isDev ? null : adminEntries.error;
  const currentPage = isDev ? 1 : adminEntries.currentPage;
  const totalEntriesCount = isDev ? mockEntries.length : adminEntries.totalEntriesCount;
  const ITEMS_PER_PAGE = isDev ? 20 : adminEntries.ITEMS_PER_PAGE;
  const activeFilters: AdminEntriesFilter = isDev ? {} : adminEntries.activeFilters;
  const sortConfig: AdminEntriesSortConfig = isDev ? { key: 'id', direction: 'asc' } : adminEntries.sortConfig;

  const handleFilterChange = isDev ? () => {} : adminEntries.handleFilterChange;
  const handleSortChange = isDev ? () => {} : adminEntries.handleSortChange;
  const handlePageChange = isDev ? () => {} : adminEntries.handlePageChange;

  const handleAddNewEntry = () => {
    alert("Admin Action: 'Add New DPO Entry' functionality to be implemented.");
  };

  return (
    <>
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
        handleIngestDataset={() => setIngestModalOpen(true)}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        handlePageChange={handlePageChange}
      />
      <IngestDatasetModal
        isOpen={isIngestModalOpen}
        onClose={() => setIngestModalOpen(false)}
        onIngest={handleIngestSubmit}
        isIngesting={isIngesting}
      />
    </>
  );
}
