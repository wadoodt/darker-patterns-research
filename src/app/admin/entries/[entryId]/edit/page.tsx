'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DPOEntryForm } from '@/components/admin/DPOEntryForm';
import { DPOEntry } from '@/types/dpo';
import { getDpoEntry } from '@/lib/firestore/queries/admin';
import { reviseDpoEntry, updateDPOEntry } from '@/lib/firestore/mutations/admin';

export default function EditDPOEntryPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = params.entryId as string;

  const [entry, setEntry] = useState<DPOEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entryId) {
      getDpoEntry(entryId)
        .then(({ entry: fetchedEntry }) => {
          if (fetchedEntry) {
            setEntry(fetchedEntry);
          } else {
            // Handle not found
            router.push('/admin/entries');
          }
        })
        .catch((error) => {
          console.error('Failed to fetch DPO entry:', error);
          // Handle error
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [entryId, router]);

  const handleSubmit = async (updatedEntry: Partial<DPOEntry>, isRevision: boolean) => {
    setIsSubmitting(true);
    try {
      if (isRevision) {
        const result = await reviseDpoEntry(entryId, updatedEntry);
        if (result.success) {
          router.push(`/admin/entries/${result.newEntryId}`);
        } else {
          throw new Error(result.message);
        }
      } else {
        await updateDPOEntry(entryId, updatedEntry);
        router.push(`/admin/entries/${entryId}`);
      }
    } catch (error) {
      console.error('Failed to update DPO entry:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      alert(`Failed to update DPO entry: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!entry) {
    return <div>Entry not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit DPO Entry</h1>
      <DPOEntryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} entry={entry} />
    </div>
  );
}
