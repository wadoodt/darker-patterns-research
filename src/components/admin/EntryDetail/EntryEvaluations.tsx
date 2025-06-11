import type { EntryWithDetails } from '@/types/entryDetails';

interface EntryEvaluationsProps {
  evaluations: NonNullable<EntryWithDetails['evaluations']>;
}

export function EntryEvaluations({ evaluations }: EntryEvaluationsProps) {
  if (!evaluations?.length) return null;

  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">Evaluations</h2>
      <div className="rounded bg-gray-100 p-4">
        <ul className="space-y-4">
          {evaluations.map((evaluation) => (
            <li key={evaluation.id} className="border-b border-gray-200 pb-2 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <strong>Rating: {evaluation.rating}/5</strong>
                  <span className="ml-4">
                    Choice: Option {evaluation.chosenOptionKey} (
                    {evaluation.wasChosenActuallyAccepted ? 'Accepted' : 'Rejected'})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {evaluation.submittedAt instanceof Date
                    ? evaluation.submittedAt.toLocaleDateString()
                    : new Date(evaluation.submittedAt.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
              {evaluation.comment && <p className="mt-1">{evaluation.comment}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
