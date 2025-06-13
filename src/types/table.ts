import type React from 'react';
import { SortableEntryKeys } from './entries';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  icon?: React.ElementType;
  renderCell: (item: T) => React.ReactNode;
}

export interface BaseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  currentSortKey: SortableEntryKeys | null;
  currentSortDirection: SortDirection;
}

export interface AdminTableProps<T, K extends keyof T> extends BaseTableProps<T> {
  onSort: (key: SortableEntryKeys | K) => void;
}

export interface AdminTableViewProps<T> extends BaseTableProps<T> {
  onSortColumn: (key: SortableEntryKeys) => void;
}
