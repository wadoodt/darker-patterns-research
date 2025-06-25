import type React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  icon?: React.ElementType;
  renderCell: (item: T) => React.ReactNode;
}

export interface BaseTableProps<T, S extends string> {
  columns: Column<T>[];
  data: T[];
  currentSortKey: S | null;
  currentSortDirection: SortDirection;
}

export interface AdminTableProps<T, S extends string> extends BaseTableProps<T, S> {
  onSort: (key: S) => void;
}

export interface AdminTableViewProps<T, S extends string> extends BaseTableProps<T, S> {
  onSortColumn: (key: S) => void;
}
