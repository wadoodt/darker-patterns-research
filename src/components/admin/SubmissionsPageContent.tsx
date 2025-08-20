'use client';

import { useAdminSubmissions } from '@/hooks/useAdminSubmissions';
import SubmissionsPageView from './SubmissionsPageView';

export default function SubmissionsPageContent() {
  const {
    submissions,
    isLoading,
    error,
    currentPage,
    totalSubmissionsCount,
    ITEMS_PER_PAGE,
    activeFilters,
    sortConfig,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
  } = useAdminSubmissions();

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // These should ideally come from a shared config or be dynamically generated
  const reasonOptions = [
    { value: 'inaccurate_response', label: 'Inaccurate Response' },
    { value: 'offensive_content', label: 'Offensive Content' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <SubmissionsPageView
      isLoading={isLoading}
      error={error}
      submissions={submissions}
      totalSubmissionsCount={totalSubmissionsCount}
      currentPage={currentPage}
      ITEMS_PER_PAGE={ITEMS_PER_PAGE}
      activeFilters={activeFilters}
      sortConfig={sortConfig}
      handleFilterChange={handleFilterChange}
      handleSortChange={handleSortChange}
      handlePageChange={handlePageChange}
      statusOptions={statusOptions}
      reasonOptions={reasonOptions}
    />
  );
}
