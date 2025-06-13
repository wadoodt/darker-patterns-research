export type StatusOption = {
  value: string;
  label: string;
};

export type EntryFilterValues = {
  category?: string;
  status?: string;
};

export interface EntriesFiltersProps {
  currentFilters: EntryFilterValues;
  onFilterChange: (filters: EntryFilterValues) => void;
  categories: string[];
  statusOptions: StatusOption[];
}
