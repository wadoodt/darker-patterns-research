'use client';

import { MoreHorizontal, View } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DisplayEvaluation } from '@/types/evaluations';

interface EvaluationsTableActionsProps {
  evaluation: DisplayEvaluation;
}

export function EvaluationsTableActions({ evaluation }: EvaluationsTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/entries/${evaluation.dpoEntryId}`} className="link-dark">
            <View className="mr-2 h-4 w-4" />
            View DPO Entry
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
