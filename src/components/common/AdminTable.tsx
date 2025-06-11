import { SortableEntryKeys } from '@/types/entries';
import type React from 'react';
import { AdminTableView } from './AdminTableView';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  icon?: React.ElementType;
  renderCell: (item: T) => React.ReactNode;
}

interface AdminTableProps<T, K extends keyof T> {
  columns: Column<T>[];
  data: T[];
  onSort: (key: SortableEntryKeys | K) => void;
  currentSortKey: SortableEntryKeys | null;
  currentSortDirection: SortDirection;
}

const AdminTable = <T, K extends keyof T>({
  columns,
  data,
  onSort,
  currentSortKey,
  currentSortDirection,
}: AdminTableProps<T, K>) => {
  const handleSort = (key: SortableEntryKeys) => {
    onSort(key);
  };

  return (
    <AdminTableView
      columns={columns}
      data={data}
      onSortColumn={handleSort}
      currentSortKey={currentSortKey}
      currentSortDirection={currentSortDirection}
    />
  );
};

export default AdminTable;
