'use client';

import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import type { AdminSubmissionsFilter } from '@/hooks/useAdminSubmissions';

interface SubmissionsFiltersProps {
  currentFilters: AdminSubmissionsFilter;
  onFilterChange: (newFilters: AdminSubmissionsFilter) => void;
  statusOptions: { value: string; label: string }[];
  reasonOptions: { value: string; label: string }[];
}

export default function SubmissionsFilters({
  currentFilters,
  onFilterChange,
  statusOptions,
  reasonOptions,
}: SubmissionsFiltersProps) {
  const handleStatusChange = (selected: string[]) => {
    onFilterChange({ ...currentFilters, status: selected });
  };

  const handleReasonChange = (selected: string[]) => {
    onFilterChange({ ...currentFilters, reason: selected });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <MultiSelectFilter
        title="Status"
        options={statusOptions}
        selectedValues={currentFilters.status || []}
        onChange={handleStatusChange}
      />
      <MultiSelectFilter
        title="Reason"
        options={reasonOptions}
        selectedValues={currentFilters.reason || []}
        onChange={handleReasonChange}
      />
    </div>
  );
}
