import { getPendingRevisions } from '@/lib/firestore/queries/admin';
import type { DPORevision } from '@/types/dpo';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Clock, User } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pending Revisions - DPV Admin',
};

const formatDate = (date: unknown): string => {
  if (!date) return 'N/A';

  // Firestore timestamps are objects with a toDate method.
  const firestoreTimestamp = date as Timestamp;
  if (typeof firestoreTimestamp.toDate === 'function') {
    return firestoreTimestamp.toDate().toLocaleString();
  }

  // Handle standard Date objects.
  if (date instanceof Date) {
    return date.toLocaleString();
  }

  // Fallback for other types.
  return String(date);
};

export default async function RevisionsPage() {
  const revisions: DPORevision[] = await getPendingRevisions();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Pending Revisions</h1>
      {revisions.length === 0 ? (
        <p>No pending revisions at this time.</p>
      ) : (
        <div className="space-y-4">
          {revisions.map((revision) => (
            <Card key={revision.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revision for Entry: {revision.originalEntryId}</span>
                  <Badge variant={revision.status === 'pending' ? 'default' : 'secondary'}>{revision.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Submitted by: {revision.submittedBy}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Submitted at: {formatDate(revision.submittedAt)}</span>
                  </div>
                </div>
                <Link
                  href={`/admin/revisions/${revision.id}`}
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
