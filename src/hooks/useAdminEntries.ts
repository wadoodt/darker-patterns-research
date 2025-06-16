// src/hooks/useAdminEntries.ts
'use client';
import { buildEntriesQuery, fetchEntriesCount, fetchEntriesData } from '@/lib/entries';
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
  key: SortableEntryKeys | 'id';
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
  const [sortConfig, setSortConfig] = useState<AdminEntriesSortConfig>({ key: 'id', direction: 'asc' });

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
    const { mainQuery, countQuery } = buildEntriesQuery(filters, sort, targetReviews, ITEMS_PER_PAGE, pageDirection, {
      first: firstDocOfCurrentPage,
      last: lastDocOfCurrentPage,
    });

    const [totalCount, { entries: fetchedEntries, cursors }] = await Promise.all([
      fetchEntriesCount(countQuery),
      fetchEntriesData(mainQuery, targetReviews),
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

export const useAdminEntries = (defaultTargetReviews: number) => {
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
      fetchAndSetEntries(page, filters, sort, targetReviews, pageDirection, state);
    },
    [state],
  );

  useEffect(() => {
    setFirstDocOfCurrentPage(null);
    setLastDocOfCurrentPage(null);
    fetchEntries(1, activeFilters, sortConfig, defaultTargetReviews, 'current');
  }, [
    activeFilters,
    sortConfig,
    defaultTargetReviews,
    fetchEntries,
    setFirstDocOfCurrentPage,
    setLastDocOfCurrentPage,
  ]);

  const handleFilterChange = (newFilters: AdminEntriesFilter) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (key: keyof DisplayEntry | 'id') => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: key as SortableEntryKeys, direction: newDirection });
    setCurrentPage(1);
  };

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
  };
};
