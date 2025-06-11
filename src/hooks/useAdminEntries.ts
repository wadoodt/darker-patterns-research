// src/hooks/useAdminEntries.ts
'use client';
import { buildEntriesQuery, fetchEntriesCount, fetchEntriesData } from '@/lib/entries';
import type { DisplayEntry, SortableEntryKeys } from '@/types/entries';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export const ITEMS_PER_PAGE = 20;

export interface AdminEntriesFilter {
  category?: string;
  status?: string;
  searchTerm?: string;
}

export interface AdminEntriesSortConfig {
  key: SortableEntryKeys | 'id';
  direction: 'asc' | 'desc';
}

export const useAdminEntries = (defaultTargetReviews: number) => {
  const [entries, setEntries] = useState<DisplayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntriesCount, setTotalEntriesCount] = useState(0);
  const [firstDocOfCurrentPage, setFirstDocOfCurrentPage] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastDocOfCurrentPage, setLastDocOfCurrentPage] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [activeFilters, setActiveFilters] = useState<AdminEntriesFilter>({});
  const [sortConfig, setSortConfig] = useState<AdminEntriesSortConfig>({ key: 'id', direction: 'asc' });

  const fetchEntries = useCallback(
    async (
      page: number,
      filters: AdminEntriesFilter,
      sort: AdminEntriesSortConfig,
      targetReviews: number,
      pageDirection: 'next' | 'prev' | 'current' = 'current',
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const { mainQuery, countQuery } = buildEntriesQuery(
          filters,
          sort,
          targetReviews,
          ITEMS_PER_PAGE,
          pageDirection,
          { first: firstDocOfCurrentPage, last: lastDocOfCurrentPage },
        );

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
    },
    [firstDocOfCurrentPage, lastDocOfCurrentPage],
  );

  useEffect(() => {
    // Fetch on initial mount and when filters/sort/targetReviews change
    // For 'current' pageDirection, cursors (first/lastDoc) should ideally be reset for accurate first page
    setFirstDocOfCurrentPage(null);
    setLastDocOfCurrentPage(null);
    fetchEntries(1, activeFilters, sortConfig, defaultTargetReviews, 'current');
  }, [activeFilters, sortConfig, defaultTargetReviews, fetchEntries]); // fetchEntries is now a dep

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
    // For direct page jumps (e.g., from pagination numbers), cursors might need reset or more complex logic
    // For simplicity, 'current' page jumps will refetch the page based on its number without relying on existing cursors
    // unless the underlying fetchEntries is adapted to handle numbered page jumps with cursors.
    if (direction === 'current' && newPage !== currentPage) {
      setFirstDocOfCurrentPage(null); // Reset cursors for a jump to a specific page number
      setLastDocOfCurrentPage(null);
    }
    fetchEntries(newPage, activeFilters, sortConfig, defaultTargetReviews, direction);
  };

  return {
    entries,
    isLoading,
    error,
    currentPage,
    totalEntriesCount,
    ITEMS_PER_PAGE,
    activeFilters,
    sortConfig,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
  };
};
