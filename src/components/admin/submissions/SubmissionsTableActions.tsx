'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import type { DisplaySubmission } from '@/types/submissions';
import { MoreHorizontal, Edit, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface SubmissionsTableActionsProps {
  submission: DisplaySubmission;
}

export function SubmissionsTableActions({ submission }: SubmissionsTableActionsProps) {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/entries/${submission.dpoEntryId}?remediate=${submission.id}`}
              className="flex items-center"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Start Remediation
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/entries/${submission.dpoEntryId}?suggestEdit=${submission.id}`}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Suggest Edit
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
