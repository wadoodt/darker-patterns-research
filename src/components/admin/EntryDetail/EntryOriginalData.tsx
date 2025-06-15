import type { EntryWithDetails } from '@/types/entryDetails';

interface EntryOriginalDataProps {
  entry: EntryWithDetails;
}

export function EntryOriginalData({ entry }: EntryOriginalDataProps) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">Original Entry Data</h2>
      <div className="rounded bg-gray-900 p-4">
        <div className="grid gap-4">
          <div>
            <strong>Instruction:</strong> {entry.instruction}
          </div>
          {entry.prompt && (
            <div>
              <strong>Prompt:</strong> {entry.prompt}
            </div>
          )}
          <div>
            <strong>Category:</strong> {entry.category}
          </div>
          <div>
            <strong>Accepted Response:</strong> {entry.acceptedResponse}
          </div>
          <div>
            <strong>Rejected Response:</strong> {entry.rejectedResponse}
          </div>
          {entry.discussion && (
            <div>
              <strong>Discussion:</strong> {entry.discussion}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
