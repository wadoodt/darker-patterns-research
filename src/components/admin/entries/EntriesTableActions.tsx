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
      <DropdownMenuTrigger asChild className="cursor-pointer hover:scale-110 hover:text-black">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 ring-offset-0 focus:ring-0 focus:outline-none focus-visible:ring-0"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-45 bg-[color:var(--color-dark-bg-secondary)]">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/admin/entries/${entry.id}`} className="admin-sidebar-navlink flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(entry.id)}
          className="admin-sidebar-navlink cursor-pointer hover:!bg-red-900 hover:!text-red-300"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Entry
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
