'use client';
import { useAdminEntries } from '@/hooks/useAdminEntries';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { EntriesPageView } from './EntriesPageView';

export default function EntriesPageContent() {
  const [categories, setCategories] = useState<string[]>([]);
  const [defaultTargetReviews, setDefaultTargetReviews] = useState(10);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchInitialSetupData = async () => {
      setInitialDataLoading(true);
      if (!db) {
        console.error('EntriesPageContent: Firebase db is not initialized.');
        setInitialDataLoading(false);
        return;
      }
      try {
        const catSnapshot = await getDocs(query(collection(db, 'dpo_entries')));
        const uniqueCategories = Array.from(new Set(catSnapshot.docs.map((doc) => doc.data().category as string)));
        setCategories(uniqueCategories.sort());

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
    fetchInitialSetupData();
  }, []);

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
  } = useAdminEntries(defaultTargetReviews);

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
