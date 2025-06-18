'use client';

import { DPOEntry } from '@/types/dpo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormField, TextArea, TextInput } from './FormElements';

interface DPOEntryFormProps {
  onSubmit: (entry: Partial<DPOEntry>) => Promise<void>;
  isSubmitting: boolean;
}

export function DPOEntryForm({ onSubmit, isSubmitting }: DPOEntryFormProps) {
  const router = useRouter();
  const [instruction, setInstruction] = useState('');
  const [prompt, setPrompt] = useState('');
  const [acceptedResponse, setAcceptedResponse] = useState('');
  const [rejectedResponse, setRejectedResponse] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Partial<DPOEntry> = {
      instruction,
      prompt,
      acceptedResponse,
      rejectedResponse,
      categories,
      reviewCount: 0,
    };
    await onSubmit(newEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField id="instruction" label="Instruction">
        <TextArea
          id="instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={3}
          required
        />
      </FormField>

      <FormField id="prompt" label="Prompt (Optional)">
        <TextArea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
      </FormField>

      <FormField id="acceptedResponse" label="Accepted Response">
        <TextArea
          id="acceptedResponse"
          value={acceptedResponse}
          onChange={(e) => setAcceptedResponse(e.target.value)}
          rows={3}
          required
        />
      </FormField>

      <FormField id="rejectedResponse" label="Rejected Response">
        <TextArea
          id="rejectedResponse"
          value={rejectedResponse}
          onChange={(e) => setRejectedResponse(e.target.value)}
          rows={3}
          required
        />
      </FormField>

      <FormField id="categories" label="Categories (comma-separated)">
        <TextInput
          id="categories"
          value={categories.join(', ')}
          onChange={(e) => setCategories(e.target.value.split(',').map((c) => c.trim()))}
          required
        />
      </FormField>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
}
