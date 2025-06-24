import type { DisplayEntry } from '@/types/entries';
import type { Column } from '@/types/table';
import { Archive, Tag } from 'lucide-react';
import Link from 'next/link';
import { EntriesTableActions } from './EntriesTableActions';

export const getTableColumns = (onDelete: (entryId: string) => void): Column<DisplayEntry>[] => [
  {
    key: 'id',
    header: 'ID',
    sortable: true,
    renderCell: (entry: DisplayEntry) => (
      <div className="flex items-center">
        {entry.isArchived && (
          <span title="Archived">
            <Archive className="mr-2 h-4 w-4 text-gray-500" />
          </span>
        )}
        <Link
          href={`/admin/entries/${entry.id}`}
          className="text-brand-white-500 hover:text-brand-white-700 cursor-pointer font-mono text-xs transition-colors hover:underline"
        >
          {entry.id.substring(0, 12)}...
        </Link>
        {/* <span className="font-mono text-xs">{entry.id.substring(0, 12)}...</span> */}
      </div>
    ),
  },
  {
    key: 'instruction',
    header: 'Instruction',
    renderCell: (entry: DisplayEntry) => (
      <Link
        href={`/admin/entries/${entry.id}`}
        className="text-brand-white-500 hover:text-brand-white-700 block max-w-xs cursor-pointer truncate text-sm transition-colors hover:underline"
        title={entry.instruction}
      >
        {entry.instruction}
      </Link>
      // <span className="block max-w-xs truncate text-sm" title={entry.instruction}>
      //   {entry.instruction}
      // </span>
    ),
  },
  {
    key: 'categories',
    header: 'Category',
    sortable: true,
    icon: Tag,
    renderCell: (entry: DisplayEntry) => <span className="text-sm">{entry.categories.join(', ')}</span>,
  },
  {
    key: 'reviewCount',
    header: 'Reviews',
    sortable: true,
    renderCell: (entry: DisplayEntry) => (
      <div className="flex items-center gap-2 text-sm">
        <span>{entry.statusText}</span>
        <div className="bg-dark-bg-tertiary h-2 w-20 overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${
              entry.reviewProgress && entry.reviewProgress >= 100 ? 'bg-green-500' : 'bg-brand-purple-500'
            }`}
            style={{ width: `${entry.reviewProgress || 0}%` }}
          ></div>
        </div>
      </div>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    renderCell: (entry: DisplayEntry) => <EntriesTableActions entry={entry} onDelete={onDelete} />,
  },
];
