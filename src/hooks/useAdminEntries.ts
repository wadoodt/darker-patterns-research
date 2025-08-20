// src/hooks/useAdminEntries.ts
'use client';
import { buildDpoEntriesQuery, fetchDpoEntriesCount, fetchDpoEntriesData } from '@/lib/firestore/queries/admin';
import type { DisplayEntry, SortableEntryKeys } from '@/types/entries';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export const ITEMS_PER_PAGE = 20;

export interface AdminEntriesFilter {
  category?: string[];
  status?: string;
  searchTerm?: string;
}

export interface AdminEntriesSortConfig {
  key: SortableEntryKeys | null;
  direction: 'asc' | 'desc';
}

const useAdminEntriesState = () => {
  const [entries, setEntries] = useState<DisplayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntriesCount, setTotalEntriesCount] = useState(0);
  const [firstDocOfCurrentPage, setFirstDocOfCurrentPage] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastDocOfCurrentPage, setLastDocOfCurrentPage] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [activeFilters, setActiveFilters] = useState<AdminEntriesFilter>({});
  const [sortConfig, setSortConfig] = useState<AdminEntriesSortConfig>({ key: 'reviewCount', direction: 'desc' });

  return {
    entries,
    setEntries,
    isLoading,
    setIsLoading,
    error,
    setError,
    currentPage,
    setCurrentPage,
    totalEntriesCount,
    setTotalEntriesCount,
    firstDocOfCurrentPage,
    setFirstDocOfCurrentPage,
    lastDocOfCurrentPage,
    setLastDocOfCurrentPage,
    activeFilters,
    setActiveFilters,
    sortConfig,
    setSortConfig,
  };
};

async function fetchAndSetEntries(
  page: number,
  filters: AdminEntriesFilter,
  sort: AdminEntriesSortConfig,
  targetReviews: number,
  pageDirection: 'next' | 'prev' | 'current',
  state: ReturnType<typeof useAdminEntriesState>,
  showArchived: boolean,
) {
  const {
    setIsLoading,
    setError,
    setTotalEntriesCount,
    setEntries,
    setFirstDocOfCurrentPage,
    setLastDocOfCurrentPage,
    setCurrentPage,
    firstDocOfCurrentPage,
    lastDocOfCurrentPage,
  } = state;

  setIsLoading(true);
  setError(null);

  try {
    const { mainQuery, countQuery } = buildDpoEntriesQuery(
      filters,
      sort,
      targetReviews,
      ITEMS_PER_PAGE,
      pageDirection,
      {
        first: firstDocOfCurrentPage,
        last: lastDocOfCurrentPage,
      },
      showArchived,
    );

    const [totalCount, { entries: fetchedEntries, cursors }] = await Promise.all([
      fetchDpoEntriesCount(countQuery),
      fetchDpoEntriesData(mainQuery, targetReviews),
    ]);
    setTotalEntriesCount(totalCount);
    setEntries(fetchedEntries);
    setFirstDocOfCurrentPage(cursors.first);
    setLastDocOfCurrentPage(cursors.last);
    setCurrentPage(page);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching DPO entries:', err);
    setError(`Failed to load DPO entries. Error: ${errorMessage}`);
  } finally {
    setIsLoading(false);
  }
}

export const useAdminEntries = (defaultTargetReviews: number, showArchived: boolean) => {
  const state = useAdminEntriesState();
  const {
    activeFilters,
    sortConfig,
    currentPage,
    setFirstDocOfCurrentPage,
    setLastDocOfCurrentPage,
    setActiveFilters,
    setCurrentPage,
    setSortConfig,
  } = state;

  const fetchEntries = useCallback(
    (
      page: number,
      filters: AdminEntriesFilter,
      sort: AdminEntriesSortConfig,
      targetReviews: number,
      pageDirection: 'next' | 'prev' | 'current' = 'current',
    ) => {
      fetchAndSetEntries(page, filters, sort, targetReviews, pageDirection, state, showArchived);
    },
    [state, showArchived],
  );

  useEffect(() => {
    setFirstDocOfCurrentPage(null);
    setLastDocOfCurrentPage(null);
    fetchEntries(1, activeFilters, sortConfig, defaultTargetReviews, 'current');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, sortConfig, defaultTargetReviews, showArchived]);

  const handleFilterChange = (newFilters: AdminEntriesFilter) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (key: SortableEntryKeys | null) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  const refetchEntries = useCallback(() => {
    setCurrentPage(1);
    setFirstDocOfCurrentPage(null);
    setLastDocOfCurrentPage(null);
    fetchEntries(1, activeFilters, sortConfig, defaultTargetReviews, 'current');
  }, [
    activeFilters,
    sortConfig,
    defaultTargetReviews,
    fetchEntries,
    setCurrentPage,
    setFirstDocOfCurrentPage,
    setLastDocOfCurrentPage,
  ]);

  const handlePageChange = (newPage: number) => {
    const direction = newPage > currentPage ? 'next' : newPage < currentPage ? 'prev' : 'current';
    if (direction === 'current' && newPage !== currentPage) {
      setFirstDocOfCurrentPage(null);
      setLastDocOfCurrentPage(null);
    }
    fetchEntries(newPage, activeFilters, sortConfig, defaultTargetReviews, direction);
  };

  return {
    ...state,
    ITEMS_PER_PAGE,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    refetchEntries,
  };
};
