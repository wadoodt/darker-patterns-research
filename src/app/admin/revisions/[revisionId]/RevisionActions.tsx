'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveRevision, rejectRevision } from '@/lib/firestore/mutations/dpo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RevisionActionsProps {
  revisionId: string;
}

export default function RevisionActions({ revisionId }: RevisionActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    const result = await approveRevision(revisionId);
    if (result.success) {
      toast.success('Revision Approved', {
        description: 'The entry has been updated successfully.',
      });
      router.push('/admin/revisions');
      router.refresh();
    } else {
      toast.error('Error Approving Revision', {
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    const comments = prompt('Please provide a reason for rejecting this revision:');
    if (comments === null) {
      return;
    }
    if (!comments.trim()) {
      toast.error('Rejection reason cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    const result = await rejectRevision(revisionId, comments);
    if (result.success) {
      toast.success('Revision Rejected', {
        description: 'The revision has been marked as rejected.',
      });
      router.push('/admin/revisions');
      router.refresh();
    } else {
      toast.error('Error Rejecting Revision', {
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-6 flex justify-end space-x-4">
      <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
        {isSubmitting ? 'Rejecting...' : 'Reject'}
      </Button>
      <Button onClick={handleApprove} disabled={isSubmitting}>
        {isSubmitting ? 'Approving...' : 'Approve'}
      </Button>
    </div>
  );
}
