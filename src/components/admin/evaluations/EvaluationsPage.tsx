'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/common/AdminTable';
import Pagination from '@/components/common/Pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { useAdminEvaluations } from '@/hooks/useAdminEvaluations';
import { Inbox, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { evaluationsTableColumns } from './EvaluationsTableColumns';

const LoadingView = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="text-brand-purple-400 h-8 w-8 animate-spin" />
    <span className="text-dark-text-secondary ml-3">Loading evaluations...</span>
  </div>
);

const EmptyStateView = () => (
  <div className="admin-card py-10 text-center">
    <Inbox size={48} className="text-dark-text-tertiary mx-auto mb-4" />
    <h3 className="text-dark-text-primary mb-2 text-xl font-semibold">No Evaluations Found</h3>
    <p className="text-dark-text-secondary mb-6">There are currently no evaluations to review.</p>
  </div>
);

export function EvaluationsPage() {
  const {
    evaluations,
    isLoading,
    totalCount,
    filters,
    sort,
    pageSize,
    handleFilterChange,
    handleSortChange,
    nextPage,
    prevPage,
  } = useAdminEvaluations();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const handlePageChange = (page: number) => {
    if (page > currentPage) {
      nextPage();
    } else if (page < currentPage) {
      prevPage();
    }
    setCurrentPage(page);
  };

  const tableContent = () => {
    if (isLoading && evaluations.length === 0) {
      return <LoadingView />;
    }
    if (!isLoading && totalCount === 0) {
      return <EmptyStateView />;
    }
    return (
      <>
        <div className="admin-card mt-6 overflow-x-auto p-0">
          <AdminTable
            columns={evaluationsTableColumns}
            data={evaluations}
            onSort={handleSortChange}
            currentSortKey={sort.key}
            currentSortDirection={sort.direction}
          />
        </div>
        {totalCount > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <AdminHeader
        title="Evaluations"
        objective="A list of all participant survey answers. Evaluations are marked as incorrect if the participant's choice did not match the expected answer."
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-incorrect"
          checked={filters.showOnlyIncorrect}
          onCheckedChange={(checked) => handleFilterChange({ showOnlyIncorrect: !!checked })}
          disabled={isLoading}
        />
        <label
          htmlFor="show-incorrect"
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show only incorrect evaluations
        </label>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {tableContent()}
    </div>
  );
}
