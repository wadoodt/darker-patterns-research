'use client';

import { useDPOEntryForm } from '@/hooks/useDPOEntryForm';
import type { DPOEntry } from '@/types/dpo';
import { useRouter } from 'next/navigation';
import { FormField, TextArea, TextInput } from './FormElements';

// Props for the main form component
interface DPOEntryFormProps {
  onSubmit: (entry: Partial<DPOEntry>, isRevision: boolean) => Promise<void>;
  isSubmitting: boolean;
  entry?: Partial<DPOEntry>;
}

// Type for the form's state and handlers, derived from the custom hook
type FormProps = ReturnType<typeof useDPOEntryForm>;

// --- Sub-components to keep the main view clean ---

function DPOFormFields(props: FormProps) {
  return (
    <>
      <FormField id="instruction" label="Instruction" description="The instruction given to the language model.">
        <TextInput
          id="instruction"
          value={props.instruction}
          onChange={(e) => props.setInstruction(e.target.value)}
          placeholder="e.g., Explain the concept of photosynthesis"
          required
        />
      </FormField>

      <FormField id="prompt" label="Prompt" description="The specific prompt used to elicit a response.">
        <TextInput
          id="prompt"
          value={props.prompt}
          onChange={(e) => props.setPrompt(e.target.value)}
          placeholder="e.g., What is photosynthesis?"
          required
        />
      </FormField>

      <FormField
        id="acceptedResponse"
        label="Accepted Response"
        description="The response that is considered correct or preferred."
      >
        <TextArea
          id="acceptedResponse"
          value={props.acceptedResponse}
          onChange={(e) => props.setAcceptedResponse(e.target.value)}
          placeholder="Provide the ideal response here..."
          required
        />
      </FormField>

      <FormField
        id="rejectedResponse"
        label="Rejected Response"
        description="The response that is considered incorrect or not preferred."
      >
        <TextArea
          id="rejectedResponse"
          value={props.rejectedResponse}
          onChange={(e) => props.setRejectedResponse(e.target.value)}
          placeholder="Provide the suboptimal response here..."
          required
        />
      </FormField>

      <FormField
        id="categories"
        label="Categories"
        description="Comma-separated list of categories for this entry (e.g., science, history)."
      >
        <TextInput
          id="categories"
          value={props.categories.join(', ')}
          onChange={(e) => props.setCategories(e.target.value.split(',').map((c) => c.trim()))}
          placeholder="e.g., science, biology"
          required
        />
      </FormField>
    </>
  );
}

function DPOFormControls({
  isSubmitting,
  entry,
  isRevision,
  setIsRevision,
  handleCancel,
}: {
  isSubmitting: boolean;
  entry?: Partial<DPOEntry>;
  isRevision: boolean;
  setIsRevision: (value: boolean) => void;
  handleCancel: () => void;
}) {
  return (
    <>
      {entry && (
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="is-revision"
              type="checkbox"
              checked={isRevision}
              onChange={(e) => setIsRevision(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="is-revision" className="font-medium text-gray-700">
              This is a substantial revision
            </label>
            <p className="text-gray-500">Check this if your edit is significant (archives the original entry).</p>
          </div>
        </div>
      )}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : entry ? 'Update Entry' : 'Create Entry'}
        </button>
      </div>
    </>
  );
}

// --- Main Component ---

export function DPOEntryForm({ onSubmit, isSubmitting, entry }: DPOEntryFormProps) {
  const router = useRouter();
  const formProps = useDPOEntryForm({ entry, onSubmit });

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={formProps.handleSubmit} className="space-y-6">
      <DPOFormFields {...formProps} />
      <DPOFormControls
        isSubmitting={isSubmitting}
        entry={entry}
        isRevision={formProps.isRevision}
        setIsRevision={formProps.setIsRevision}
        handleCancel={handleCancel}
      />
    </form>
  );
}
