import Link from 'next/link';
import type { DPOEntry } from '@/types/dpo';
import { Archive, FileText } from 'lucide-react';

interface RevisionInfoBannerProps {
  entry: DPOEntry;
}

export function RevisionInfoBanner({ entry }: RevisionInfoBannerProps) {
  if (!entry.isArchived && !entry.originalEntryId) {
    return null;
  }

  if (entry.isArchived && entry.supersededByEntryId) {
    return (
      <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        <div className="flex items-center">
          <Archive className="mr-2 h-5 w-5" />
          <p>
            This entry is archived and has been superseded by a new version.{' '}
            <Link
              href={`/admin/entries/${entry.supersededByEntryId}`}
              className="font-semibold underline hover:text-yellow-900"
            >
              View the new version
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (entry.originalEntryId) {
    return (
      <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          <p>
            This entry is a revision of a previous version.{' '}
            <Link
              href={`/admin/entries/${entry.originalEntryId}`}
              className="font-semibold underline hover:text-blue-900"
            >
              View the original archived version
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return null;
}
