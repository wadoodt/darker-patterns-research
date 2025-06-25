import { Badge } from '@/components/ui/badge';
import type { DisplaySubmission } from '@/types/submissions';
import type { Column } from '@/types/table';
import Link from 'next/link';
import { SubmissionsTableActions } from './SubmissionsTableActions';

// TODO: Implement Row Actions (e.g., Start Remediation)

export const submissionsTableColumns: Column<DisplaySubmission>[] = [
  {
    key: 'dpoEntryId',
    header: 'DPO Entry',
    renderCell: (item) => (
      <Link href={`/admin/entries/${item.dpoEntryId}`} className="hover:underline">
        {item.dpoEntryId.substring(0, 8)}...
      </Link>
    ),
  },
  {
    key: 'reason',
    header: 'Reason',
    sortable: true,
    renderCell: (item) => item.reason,
  },
  {
    key: 'comment',
    header: 'Comment',
    renderCell: (item) => <p className="max-w-xs truncate">{item.comment}</p>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    renderCell: (item) => {
      const variant =
        item.status === 'resolved'
          ? 'default'
          : item.status === 'rejected'
            ? 'destructive'
            : item.status === 'under_review'
              ? 'secondary'
              : 'default';
      return <Badge variant={variant}>{item.status}</Badge>;
    },
  },
  {
    key: 'flaggedAt',
    header: 'Date',
    sortable: true,
    renderCell: (item) => new Date(item.flaggedAt).toLocaleDateString(),
  },
  {
    key: 'actions',
    header: 'Actions',
    renderCell: (item) => <SubmissionsTableActions submission={item} />,
  },
];
