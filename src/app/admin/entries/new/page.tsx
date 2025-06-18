'use client';

import { DPOEntryForm } from '@/components/admin/DPOEntryForm';
import { DPOEntry } from '@/types/dpo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addDPOEntry } from '@/lib/firestore/mutations/admin';

export default function NewDPOEntryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (entry: Partial<DPOEntry>) => {
    setIsSubmitting(true);
    try {
      await addDPOEntry(entry as DPOEntry);
      router.push('/admin/entries');
    } catch (error) {
      console.error('Failed to add new DPO entry:', error);
      alert('Failed to add new DPO entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Add New DPO Entry</h1>
      <DPOEntryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
