'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
          className={cn('w-full justify-between', className)}
        >
          <div className="flex flex-wrap items-center gap-1">
            {value.length > 0 ? (
              value.map((val) => (
                <Badge key={val} variant="secondary" className="mr-1">
                  {options.find((opt) => opt.value === val)?.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(val);
                    }}
                    className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span>{placeholder || 'Select...'}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    'cursor-pointer px-2 py-1',
                    'hover:bg-blue-500 hover:text-white',
                    value.includes(option.value) && 'bg-blue-100 text-blue-900',
                  )}
                >
                  <Check className={cn('mr-2 h-4 w-4', value.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
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
