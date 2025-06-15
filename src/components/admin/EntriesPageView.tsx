import { Button } from '@/components/ui/button';
import { AdminEntriesFilter } from '@/hooks/useAdminEntries';
import type { DisplayEntry, SortableEntryKeys } from '@/types/entries';
import { Column } from '@/types/table';
import { Eye, Loader2, PlusCircle, Tag, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import AdminTable from '../common/AdminTable';
import Pagination from '../common/Pagination';
import AdminHeader from './AdminHeader';
import EntriesFilters from './EntriesFilters';

interface EntriesPageViewProps {
  isAdmin: boolean;
  initialDataLoading: boolean;
  isLoadingEntries: boolean;
  error: string | null;
  entries: DisplayEntry[];
  totalEntriesCount: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  categories: string[];
  activeFilters: AdminEntriesFilter;
  sortConfig: { key: SortableEntryKeys | null; direction: 'asc' | 'desc' | null };
  handleAddNewEntry: () => void;
  handleIngestDataset: () => void;
  handleFilterChange: (filters: AdminEntriesFilter) => void;
  handleSortChange: (key: SortableEntryKeys) => void;
  handlePageChange: (page: number) => void;
}

const LoadingView = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="text-brand-purple-400 h-8 w-8 animate-spin" />
    <span className="text-dark-text-secondary ml-3">Loading entries...</span>
  </div>
);

const EmptyStateView = ({ isAdmin, onIngest }: { isAdmin: boolean; onIngest: () => void }) => (
  <div className="admin-card py-10 text-center">
    <UploadCloud size={48} className="text-dark-text-tertiary mx-auto mb-4" />
    <h3 className="text-dark-text-primary mb-2 text-xl font-semibold">No DPO Entries Found</h3>
    {isAdmin ? (
      <>
        <p className="text-dark-text-secondary mb-6">
          The dataset appears to be empty. You can ingest an initial dataset to get started.
        </p>
        <Button
          onClick={onIngest}
          className="btn-cta-dark bg-gradient-to-r from-green-600 to-teal-600 px-5 py-2.5 text-sm hover:from-green-500 hover:to-teal-500"
        >
          <UploadCloud size={18} className="mr-2" /> Ingest Initial Dataset
        </Button>
      </>
    ) : (
      <p className="text-dark-text-secondary mb-6">
        The dataset appears to be empty. Please contact an administrator if a dataset needs to be ingested or if this is
        unexpected.
      </p>
    )}
  </div>
);

const tableColumns: Column<DisplayEntry>[] = [
  {
    key: 'id',
    header: 'ID',
    sortable: true,
    renderCell: (entry: DisplayEntry) => <span className="font-mono text-xs">{entry.id.substring(0, 12)}...</span>,
  },
  {
    key: 'instruction',
    header: 'Instruction',
    renderCell: (entry: DisplayEntry) => (
      <span className="block max-w-xs truncate text-sm" title={entry.instruction}>
        {entry.instruction}
      </span>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    icon: Tag,
    renderCell: (entry: DisplayEntry) => <span className="text-sm">{entry.category}</span>,
  },
  {
    key: 'reviewCount',
    header: 'Reviews',
    sortable: true,
    renderCell: (entry: DisplayEntry) => (
      <div className="flex items-center gap-2 text-sm">
        <span>{entry.statusText}</span>
        <div className="bg-dark-bg-tertiary h-2 w-20 overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${entry.reviewProgress && entry.reviewProgress >= 100 ? 'bg-green-500' : 'bg-brand-purple-500'}`}
            style={{ width: `${entry.reviewProgress || 0}%` }}
          ></div>
        </div>
      </div>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    renderCell: (entry: DisplayEntry) => (
      <Link
        href={`/entries/${entry.id}`}
        className="text-brand-purple-400 flex items-center gap-1 text-sm font-medium hover:underline"
      >
        <Eye size={16} /> View
      </Link>
    ),
  },
];

export function EntriesPageView({
  isAdmin,
  initialDataLoading,
  isLoadingEntries,
  error,
  entries,
  totalEntriesCount,
  currentPage,
  ITEMS_PER_PAGE,
  categories,
  activeFilters,
  sortConfig,
  handleAddNewEntry,
  handleIngestDataset,
  handleFilterChange,
  handleSortChange,
  handlePageChange,
}: EntriesPageViewProps) {
  if (initialDataLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">
        <AdminHeader
          title="DPO Entries Management"
          objective="Browse, filter, and review submitted human evaluations for each DPO entry."
        />
        <LoadingView />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <AdminHeader
          title="DPO Entries Management"
          objective="Browse, filter, and review submitted human evaluations for each DPO entry."
          className="mb-0"
        />
        {isAdmin && (
          <Button onClick={handleAddNewEntry} className="btn-primary-dark px-4 py-2 text-sm">
            <PlusCircle size={18} className="mr-2" /> Add New DPO Entry
          </Button>
        )}
      </div>

      <EntriesFilters
        currentFilters={activeFilters}
        onFilterChange={handleFilterChange}
        categories={categories}
        statusOptions={[
          { value: '', label: 'All Statuses' },
          { value: 'needs_reviews', label: 'Needs Reviews' },
          { value: 'completed', label: 'Completed' },
        ]}
      />

      {isLoadingEntries && <LoadingView />}
      {!isLoadingEntries && error && <p className="py-10 text-center text-red-400">{error}</p>}
      {!isLoadingEntries && !error && totalEntriesCount === 0 && (
        <EmptyStateView isAdmin={isAdmin} onIngest={handleIngestDataset} />
      )}

      {!isLoadingEntries && !error && totalEntriesCount > 0 && (
        <div className="admin-card mt-6 overflow-x-auto p-0">
          <AdminTable
            columns={tableColumns}
            data={entries}
            onSort={handleSortChange}
            currentSortKey={sortConfig.key}
            currentSortDirection={sortConfig.direction}
          />
        </div>
      )}

      {!isLoadingEntries && totalEntriesCount > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalEntriesCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
