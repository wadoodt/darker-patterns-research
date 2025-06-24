'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DisplayEntry } from '@/types/entries';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EntriesTableActionsProps {
  entry: DisplayEntry;
  onDelete: (entryId: string) => void;
}

export function EntriesTableActions({ entry, onDelete }: EntriesTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer transition-transform hover:scale-130 hover:text-black">
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 hover:text-black">
          <Link href={`/admin/entries/${entry.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(entry.id)}
          className="cursor-pointer text-red-600 hover:bg-gray-100 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Entry
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
