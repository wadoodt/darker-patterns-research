'use client';

import AdminTable from '@/components/common/AdminTable';
import Pagination from '@/components/common/Pagination';
import type { AdminSubmissionsFilter, AdminSubmissionsSortConfig } from '@/hooks/useAdminSubmissions';
import type { DisplaySubmission, SortableSubmissionKeys } from '@/types/submissions';
import { Inbox, Loader2 } from 'lucide-react';
import AdminHeader from './AdminHeader';
import { submissionsTableColumns } from './submissions/SubmissionsTableColumns';
import SubmissionsFilters from './submissions/SubmissionsFilters';

// --- PROPS ---
interface SubmissionsPageViewProps {
  isLoading: boolean;
  error: string | null;
  submissions: DisplaySubmission[];
  totalSubmissionsCount: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  activeFilters: AdminSubmissionsFilter;
  sortConfig: AdminSubmissionsSortConfig;
  handleFilterChange: (filters: AdminSubmissionsFilter) => void;
  handleSortChange: (key: SortableSubmissionKeys) => void;
  handlePageChange: (page: number) => void;
  statusOptions: { value: string; label: string }[];
  reasonOptions: { value: string; label: string }[];
}

// --- SUB-COMPONENTS ---

const LoadingView = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="text-brand-purple-400 h-8 w-8 animate-spin" />
    <span className="text-dark-text-secondary ml-3">Loading submissions...</span>
  </div>
);

const EmptyStateView = () => (
  <div className="admin-card py-10 text-center">
    <Inbox size={48} className="text-dark-text-tertiary mx-auto mb-4" />
    <h3 className="text-dark-text-primary mb-2 text-xl font-semibold">No Submissions Found</h3>
    <p className="text-dark-text-secondary mb-6">There are currently no submissions to review.</p>
  </div>
);

const SubmissionsPageHeader = () => (
  <div className="mb-6 flex items-center justify-between">
    <AdminHeader
      title="Submissions Management"
      objective="Review and remediate participant-flagged issues."
      className="mb-0"
    />
  </div>
);

const SubmissionsTableContent = (props: SubmissionsPageViewProps) => {
  if (props.isLoading) {
    return <LoadingView />;
  }
  if (props.error) {
    return <p className="py-10 text-center text-red-400">{props.error}</p>;
  }
  if (props.totalSubmissionsCount === 0) {
    return <EmptyStateView />;
  }
  return (
    <>
      <div className="admin-card mt-6 overflow-x-auto p-0">
        <AdminTable
          columns={submissionsTableColumns}
          data={props.submissions}
          onSort={props.handleSortChange}
          currentSortKey={props.sortConfig.key}
          currentSortDirection={props.sortConfig.direction}
        />
      </div>
      {props.totalSubmissionsCount > props.ITEMS_PER_PAGE && (
        <Pagination
          currentPage={props.currentPage}
          totalItems={props.totalSubmissionsCount}
          itemsPerPage={props.ITEMS_PER_PAGE}
          onPageChange={props.handlePageChange}
        />
      )}
    </>
  );
};

// --- MAIN COMPONENT ---

export default function SubmissionsPageView(props: SubmissionsPageViewProps) {
  return (
    <div className="flex h-full flex-col">
      <SubmissionsPageHeader />
      <SubmissionsFilters
        currentFilters={props.activeFilters}
        onFilterChange={props.handleFilterChange}
        statusOptions={props.statusOptions}
        reasonOptions={props.reasonOptions}
      />
      <SubmissionsTableContent {...props} />
    </div>
  );
}
