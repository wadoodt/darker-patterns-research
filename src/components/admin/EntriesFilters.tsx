import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import type { EntriesFiltersProps } from './EntriesFilters.types';

const EntriesFilters: React.FC<EntriesFiltersProps> = ({
  currentFilters,
  onFilterChange,
  categories,
  statusOptions,
}) => {
  const handleCategoryChange = (value: string) => {
    onFilterChange({ category: value === 'all' ? '' : value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value === 'all' ? '' : value });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-dark-text-secondary text-sm font-medium">Category:</label>
        <Select onValueChange={handleCategoryChange} value={currentFilters.category || 'all'}>
          <SelectTrigger className="bg-dark-bg-secondary border-dark-border text-dark-text-primary w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-dark-bg-secondary border-dark-border text-dark-text-primary">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
