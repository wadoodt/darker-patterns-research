'use client';
import { buildSubmissionsQuery, fetchSubmissionsCount, fetchSubmissionsData } from '@/lib/firestore/queries/admin';
import type { DisplaySubmission, SortableSubmissionKeys } from '@/types/submissions';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export const ITEMS_PER_PAGE = 20;

export interface AdminSubmissionsFilter {
  status?: string[];
  reason?: string[];
  searchTerm?: string;
}

export interface AdminSubmissionsSortConfig {
  key: SortableSubmissionKeys;
  direction: 'asc' | 'desc';
}

const useAdminSubmissionsState = () => {
  const [submissions, setSubmissions] = useState<DisplaySubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState(0);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [activeFilters, setActiveFilters] = useState<AdminSubmissionsFilter>({});
  const [sortConfig, setSortConfig] = useState<AdminSubmissionsSortConfig>({ key: 'flaggedAt', direction: 'desc' });

  return {
    submissions,
    setSubmissions,
    isLoading,
    setIsLoading,
    error,
    setError,
    currentPage,
    setCurrentPage,
    totalSubmissionsCount,
    setTotalSubmissionsCount,
    firstDoc,
    setFirstDoc,
    lastDoc,
    setLastDoc,
    activeFilters,
    setActiveFilters,
    sortConfig,
    setSortConfig,
  };
};

async function fetchAndSetSubmissions(
  page: number,
  filters: AdminSubmissionsFilter,
  sort: AdminSubmissionsSortConfig,
  pageDirection: 'next' | 'prev' | 'current',
  state: ReturnType<typeof useAdminSubmissionsState>,
) {
  const {
    setIsLoading,
    setError,
    setTotalSubmissionsCount,
    setSubmissions,
    setFirstDoc,
    setLastDoc,
    setCurrentPage,
    firstDoc,
    lastDoc,
  } = state;

  setIsLoading(true);
  setError(null);

  try {
    const { mainQuery, countQuery } = buildSubmissionsQuery(filters, sort, ITEMS_PER_PAGE, pageDirection, {
      first: firstDoc,
      last: lastDoc,
    });

    const [totalCount, { submissions: fetchedSubmissions, cursors }] = await Promise.all([
      fetchSubmissionsCount(countQuery),
      fetchSubmissionsData(mainQuery),
    ]);
    setTotalSubmissionsCount(totalCount);
    setSubmissions(fetchedSubmissions);
    setFirstDoc(cursors.first);
    setLastDoc(cursors.last);
    setCurrentPage(page);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching submissions:', err);
    setError(`Failed to load submissions. Error: ${errorMessage}`);
  } finally {
    setIsLoading(false);
  }
}

export const useAdminSubmissions = () => {
  const state = useAdminSubmissionsState();
  const {
    activeFilters,
    sortConfig,
    currentPage,
    setFirstDoc,
    setLastDoc,
    setActiveFilters,
    setCurrentPage,
    setSortConfig,
  } = state;

  const fetchSubmissions = useCallback(
    (
      page: number,
      filters: AdminSubmissionsFilter,
      sort: AdminSubmissionsSortConfig,
      pageDirection: 'next' | 'prev' | 'current' = 'current',
    ) => {
      fetchAndSetSubmissions(page, filters, sort, pageDirection, state);
    },
    [state],
  );

  useEffect(() => {
    setFirstDoc(null);
    setLastDoc(null);
    fetchSubmissions(1, activeFilters, sortConfig, 'current');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, sortConfig]);

  const handleFilterChange = (newFilters: AdminSubmissionsFilter) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (key: SortableSubmissionKeys) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  const refetchSubmissions = useCallback(() => {
    setCurrentPage(1);
    setFirstDoc(null);
    setLastDoc(null);
    fetchSubmissions(1, activeFilters, sortConfig, 'current');
  }, [activeFilters, sortConfig, fetchSubmissions, setCurrentPage, setFirstDoc, setLastDoc]);

  const handlePageChange = (newPage: number) => {
    const direction = newPage > currentPage ? 'next' : newPage < currentPage ? 'prev' : 'current';
    if (direction === 'current' && newPage !== currentPage) {
      setFirstDoc(null);
      setLastDoc(null);
    }
    fetchSubmissions(newPage, activeFilters, sortConfig, direction);
  };

  return {
    ...state,
    ITEMS_PER_PAGE,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    refetchSubmissions,
  };
};
