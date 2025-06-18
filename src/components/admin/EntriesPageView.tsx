'use client';

import { Button } from '@/components/ui/button';
import type { AdminEntriesFilter, AdminEntriesSortConfig } from '@/hooks/useAdminEntries';
import type { DisplayEntry, SortableEntryKeys } from '@/types/entries';
import { Loader2, PlusCircle, UploadCloud } from 'lucide-react';
import AdminTable from '../common/AdminTable';
import Pagination from '../common/Pagination';
import AdminHeader from './AdminHeader';
import EntriesFilters from './EntriesFilters';
import { tableColumns } from './entries/EntriesTableColumns';

// --- PROPS ---
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
  sortConfig: AdminEntriesSortConfig;
  handleAddNewEntry: () => void;
  handleIngestDataset: () => void;
  handleFilterChange: (filters: AdminEntriesFilter) => void;
  handleSortChange: (key: SortableEntryKeys) => void;
  handlePageChange: (page: number) => void;
  showArchived: boolean;
  setShowArchived: (value: boolean) => void;
}

// --- SUB-COMPONENTS ---

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

const EntriesPageHeader = ({ isAdmin, onAddNew }: { isAdmin: boolean; onAddNew: () => void }) => (
  <div className="mb-6 flex items-center justify-between">
    <AdminHeader
      title="DPO Entries Management"
      objective="Browse, filter, and review submitted human evaluations for each DPO entry."
      className="mb-0"
    />
    {isAdmin && (
      <Button onClick={onAddNew} className="btn-primary-dark px-4 py-2 text-sm">
        <PlusCircle size={18} className="mr-2" /> Add New DPO Entry
      </Button>
    )}
  </div>
);

const EntriesPageToolbar = ({
  activeFilters,
  handleFilterChange,
  categories,
  showArchived,
  setShowArchived,
}: {
  activeFilters: AdminEntriesFilter;
  handleFilterChange: (filters: AdminEntriesFilter) => void;
  categories: string[];
  showArchived: boolean;
  setShowArchived: (value: boolean) => void;
}) => (
  <>
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
    <div className="mt-4 flex items-center justify-end">
      <label htmlFor="show-archived" className="mr-2 text-sm font-medium text-gray-700">
        Show Archived
      </label>
      <input
        id="show-archived"
        type="checkbox"
        checked={showArchived}
        onChange={(e) => setShowArchived(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
    </div>
  </>
);

const EntriesTableContent = (props: EntriesPageViewProps) => {
  if (props.isLoadingEntries) {
    return <LoadingView />;
  }
  if (props.error) {
    return <p className="py-10 text-center text-red-400">{props.error}</p>;
  }
  if (props.totalEntriesCount === 0) {
    return <EmptyStateView isAdmin={props.isAdmin} onIngest={props.handleIngestDataset} />;
  }
  return (
    <>
      <div className="admin-card mt-6 overflow-x-auto p-0">
        <AdminTable
          columns={tableColumns}
          data={props.entries}
          onSort={props.handleSortChange}
          currentSortKey={props.sortConfig.key}
          currentSortDirection={props.sortConfig.direction}
        />
      </div>
      {props.totalEntriesCount > props.ITEMS_PER_PAGE && (
        <Pagination
          currentPage={props.currentPage}
          totalItems={props.totalEntriesCount}
          itemsPerPage={props.ITEMS_PER_PAGE}
          onPageChange={props.handlePageChange}
        />
      )}
    </>
  );
};

// --- MAIN COMPONENT ---

export function EntriesPageView(props: EntriesPageViewProps) {
  if (props.initialDataLoading) {
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
      <EntriesPageHeader isAdmin={props.isAdmin} onAddNew={props.handleAddNewEntry} />
      <EntriesPageToolbar
        activeFilters={props.activeFilters}
        handleFilterChange={props.handleFilterChange}
        categories={props.categories}
        showArchived={props.showArchived}
        setShowArchived={props.setShowArchived}
      />
      <EntriesTableContent {...props} />
    </main>
  );
}
