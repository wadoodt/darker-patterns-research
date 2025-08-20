'use client';

import { useAdminEntries } from '@/hooks/useAdminEntries';
import { useAdminPageSetup } from '@/hooks/useAdminPageSetup';
import { useAuth } from '@/hooks/useAuth';
import { HARM_CATEGORIES } from '@/lib/harm-categories';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EntriesPageView } from './EntriesPageView';
import { IngestDatasetModal } from './IngestDatasetModal';

export default function EntriesPageContent() {
  const { isAdmin } = useAuth();
  const [showArchived, setShowArchived] = useState(false);
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

  const { refetchEntries, ...adminEntries } = useAdminEntries(defaultTargetReviews, showArchived);

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

  const router = useRouter();

  const handleAddNewEntry = () => {
    router.push('/admin/entries/new');
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
        showArchived={showArchived}
        setShowArchived={setShowArchived}
        setNeedsRefetch={setNeedsRefetch}
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
