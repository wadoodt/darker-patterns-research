'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder, className }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    const newValues = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValues);
  };

  const handleRemove = (selectedValue: string) => {
    onChange(value.filter((v) => v !== selectedValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-fit w-full items-start justify-between', className)}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {value.length > 0 ? (
              value.map((val) => (
                <Badge key={val} variant="secondary" className="mr-1">
                  {options.find((opt) => opt.value === val)?.label}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(val);
                    }}
                    className="ring-offset-background ml-1 cursor-pointer rounded-full outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                  >
                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                  </span>
                </Badge>
              ))
            ) : (
              <span>{placeholder || 'Select...'}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 self-start opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    'cursor-pointer px-2 py-1',
                    'text-white/70',
                    '200 hover:[background-color:var(--color-dark-bg-tertiary)] hover:text-white/100',
                    value.includes(option.value) && 'text-white-200 bg-dark-100',
                  )}
                >
                  {option.label}
                  <Check
                    className={cn('mr-2 ml-auto h-4 w-4', value.includes(option.value) ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
