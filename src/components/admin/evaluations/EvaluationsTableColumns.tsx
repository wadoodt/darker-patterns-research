'use client';

import { AlertTriangle, CheckCircle, CircleXIcon, MessageCircleMoreIcon, MessageCircleXIcon } from 'lucide-react';

import type { DisplayEvaluation } from '@/types/evaluations';
import type { Column } from '@/types/table';
import Link from 'next/link';
import { EvaluationsTableActions } from './EvaluationsTableActions';

export const evaluationsTableColumns: Column<DisplayEvaluation>[] = [
  {
    key: 'isIncorrect',
    header: 'Status',
    renderCell: (item) => {
      return item.isIncorrect ? (
        <div className="text-destructive flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>Incorrect</span>
        </div>
      ) : (
        <div className="text-muted-foreground flex items-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Correct</span>
        </div>
      );
    },
  },
  {
    key: 'dpoEntryInstruction',
    header: 'DPO Entry Instruction',
    renderCell: (item) => (
      <div className="w-[300px] truncate">
        <Link href={`/admin/evaluations/${item.id}`} className="hover:underline">
          {item.dpoEntryInstruction}
        </Link>
      </div>
    ),
  },
  {
    key: 'chosenOptionKey',
    header: 'Same as researcher?',
    renderCell: (item) =>
      item.wasChosenActuallyAccepted ? (
        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
      ) : (
        <CircleXIcon className="mr-2 h-4 w-4 text-red-500" />
      ),
  },
  {
    key: 'hasComment',
    header: 'Has Comment',
    renderCell: (item) =>
      item.comment?.length ? (
        <MessageCircleMoreIcon className="mr-2 h-4 w-4 text-green-500" />
      ) : (
        <MessageCircleXIcon className="mr-2 h-4 w-4 text-red-500" />
      ),
  },
  {
    key: 'agreementRating',
    header: 'Agreement',
    sortable: true,
    renderCell: (item) => (
      <span
        className={
          Number(item.agreementRating) >= 3
            ? 'text-green-500'
            : Number(item.agreementRating) >= 2
              ? 'text-yellow-500'
              : 'text-red-500'
        }
      >
        {Number(item.agreementRating || 0)}/5
      </span>
    ),
  },
  {
    key: 'submittedAt',
    header: 'Submitted At',
    sortable: true,
    renderCell: (item) => new Date(item.submittedAt).toLocaleString(),
  },
  {
    key: 'actions',
    header: 'Actions',
    renderCell: (item) => <EvaluationsTableActions evaluation={item} />,
  },
];
