'use client';

import { Check, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- TYPES ---
interface MultiSelectFilterProps {
  title: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

// --- SUB-COMPONENTS ---
const SelectedFiltersBadge = ({ options, selectedValues }: Omit<MultiSelectFilterProps, 'title' | 'onChange'>) => {
  if (selectedValues.length === 0) return null;

  return (
    <>
      <Separator orientation="vertical" className="mx-2 h-4" />
      <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
        {selectedValues.length}
      </Badge>
      <div className="hidden space-x-1 lg:flex">
        {selectedValues.length > 2 ? (
          <Badge variant="secondary" className="rounded-sm px-1 font-normal">
            {selectedValues.length} selected
          </Badge>
        ) : (
          options
            .filter((option) => selectedValues.includes(option.value))
            .map((option) => (
              <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                {option.label}
              </Badge>
            ))
        )}
      </div>
    </>
  );
};

interface FilterCommandListProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  handleSelect: (value: string) => void;
  clearFilters: () => void;
}

const FilterCommandList = ({ options, selectedValues, handleSelect, clearFilters }: FilterCommandListProps) => (
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
            <div
              className={cn(
                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
              )}
            >
              <Check className={cn('h-4 w-4')} />
            </div>
            <span>{option.label}</span>
          </CommandItem>
        );
      })}
    </CommandGroup>
    {selectedValues.length > 0 && (
      <>
        <CommandSeparator />
        <CommandGroup>
          <CommandItem onSelect={clearFilters} className="justify-center text-center">
            Clear filters
          </CommandItem>
        </CommandGroup>
      </>
    )}
  </CommandList>
);

// --- MAIN COMPONENT ---
export function MultiSelectFilter({ title, options, selectedValues, onChange }: MultiSelectFilterProps) {
  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          <SelectedFiltersBadge options={options} selectedValues={selectedValues} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <FilterCommandList
            options={options}
            selectedValues={selectedValues}
            handleSelect={handleSelect}
            clearFilters={() => onChange([])}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
