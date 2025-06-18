import { useState } from 'react';
import type { DPOEntry } from '@/types/dpo';

interface UseDPOEntryFormProps {
  entry?: Partial<DPOEntry>;
  onSubmit: (entry: Partial<DPOEntry>, isRevision: boolean) => Promise<void>;
}

export function useDPOEntryForm({ entry, onSubmit }: UseDPOEntryFormProps) {
  const [instruction, setInstruction] = useState(entry?.instruction || '');
  const [prompt, setPrompt] = useState(entry?.prompt || '');
  const [acceptedResponse, setAcceptedResponse] = useState(entry?.acceptedResponse || '');
  const [rejectedResponse, setRejectedResponse] = useState(entry?.rejectedResponse || '');
  const [categories, setCategories] = useState<string[]>(entry?.categories || []);
  const [isRevision, setIsRevision] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Partial<DPOEntry> = {
      instruction,
      prompt,
      acceptedResponse,
      rejectedResponse,
      categories,
      reviewCount: entry?.reviewCount || 0, // Preserve existing review count on edit
    };
    await onSubmit(newEntry, isRevision);
  };

  return {
    instruction,
    setInstruction,
    prompt,
    setPrompt,
    acceptedResponse,
    setAcceptedResponse,
    rejectedResponse,
    setRejectedResponse,
    categories,
    setCategories,
    isRevision,
    setIsRevision,
    handleSubmit,
  };
}
