import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MultiSelect from '@/components/ui/MultiSelect';
import React from 'react';
export type StatusOption = {
  value: string;
  label: string;
};

export type EntryFilterValues = {
  category?: string[];
  status?: string;
};

export interface EntriesFiltersProps {
  currentFilters: EntryFilterValues;
  onFilterChange: (filters: EntryFilterValues) => void;
  categories: string[];
  statusOptions: StatusOption[];
}

const EntriesFilters: React.FC<EntriesFiltersProps> = ({
  currentFilters,
  onFilterChange,
  categories,
  statusOptions,
}) => {
  const handleCategoryChange = (values: string[]) => {
    onFilterChange({ category: values });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value === 'all' ? '' : value });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-dark-text-secondary text-sm font-medium">Category:</label>
        <MultiSelect
          options={categories.map((c) => ({ value: c, label: c }))}
          value={currentFilters.category || []}
          onChange={handleCategoryChange}
          placeholder="Select categories..."
          className="bg-dark-bg-secondary border-dark-border text-dark-text-primary w-[250px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-dark-text-secondary text-sm font-medium">Status:</label>
        <Select onValueChange={handleStatusChange} value={currentFilters.status || 'all'}>
          <SelectTrigger className="bg-dark-bg-secondary border-dark-border text-dark-text-primary w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-dark-bg-secondary border-dark-border text-dark-text-primary">
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(
              (option) =>
                option.value && (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ),
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EntriesFilters;
