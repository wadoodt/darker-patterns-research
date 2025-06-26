'use client';

import {
  buildEvaluationsQuery,
  fetchEvaluationsCount,
  fetchEvaluationsData,
} from '@/lib/firestore/queries/evaluations';
import type { DisplayEvaluation, SortableEvaluationKeys } from '@/types/evaluations';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export interface AdminEvaluationsFilter {
  showOnlyIncorrect: boolean;
}

export interface AdminEvaluationsSortConfig {
  key: SortableEvaluationKeys | null;
  direction: 'asc' | 'desc';
}

const DEFAULT_PAGE_SIZE = 10;

export function useAdminEvaluations() {
  const [evaluations, setEvaluations] = useState<DisplayEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<AdminEvaluationsFilter>({ showOnlyIncorrect: true });
  const [sort, setSort] = useState<AdminEvaluationsSortConfig>({ key: 'submittedAt', direction: 'desc' });
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [cursors, setCursors] = useState<{ first: QueryDocumentSnapshot | null; last: QueryDocumentSnapshot | null }>({
    first: null,
    last: null,
  });

  const fetchData = useCallback(
    async (pageDirection: 'next' | 'prev' | 'current' = 'current') => {
      setIsLoading(true);
      try {
        const { mainQuery, countQuery } = buildEvaluationsQuery(filters, sort, pageSize, pageDirection, cursors);
        const [data, count] = await Promise.all([fetchEvaluationsData(mainQuery), fetchEvaluationsCount(countQuery)]);

        setEvaluations(data.evaluations);
        setCursors({ first: data.first, last: data.last });
        setTotalCount(count);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sort, pageSize, cursors],
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.showOnlyIncorrect, sort.key, sort.direction]);

  const handleFilterChange = (newFilters: Partial<AdminEvaluationsFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (key: SortableEvaluationKeys) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const nextPage = () => fetchData('next');
  const prevPage = () => fetchData('prev');

  return {
    evaluations,
    isLoading,
    totalCount,
    filters,
    sort,
    pageSize,
    handleFilterChange,
    handleSortChange,
    handlePageSizeChange,
    nextPage,
    prevPage,
  };
}
