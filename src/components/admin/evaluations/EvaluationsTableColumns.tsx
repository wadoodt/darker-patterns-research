'use client';

'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';

import type { DisplayEvaluation } from '@/types/evaluations';
import type { Column } from '@/types/table';
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
    renderCell: (item) => <div className="w-[300px] truncate">{item.dpoEntryInstruction}</div>,
  },
  {
    key: 'chosenOptionKey',
    header: 'Participant Choice',
    sortable: true,
    renderCell: (item) => item.chosenOptionKey,
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
