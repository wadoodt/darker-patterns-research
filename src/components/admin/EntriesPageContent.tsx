'use client';

import { useEffect } from 'react';
import { HARM_CATEGORIES } from '@/lib/harm-categories';
import { useAdminEntries } from '@/hooks/useAdminEntries';
import { useAdminPageSetup } from '@/hooks/useAdminPageSetup';
import { useAuth } from '@/hooks/useAuth';
import { EntriesPageView } from './EntriesPageView';
import { IngestDatasetModal } from './IngestDatasetModal';

export default function EntriesPageContent() {
  const { isAdmin } = useAuth();
  const categories = HARM_CATEGORIES.map((c: { name: string }) => c.name);

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

  const {
    entries,
    isLoading: isLoadingEntries,
    error,
    currentPage,
    totalEntriesCount,
    ITEMS_PER_PAGE,
    activeFilters,
    sortConfig,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
  } = adminEntries;

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
