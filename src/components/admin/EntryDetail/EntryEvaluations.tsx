import type { EntryWithDetails } from '@/types/entryDetails';

interface EntryEvaluationsProps {
  evaluations: NonNullable<EntryWithDetails['evaluations']>;
}

export function EntryEvaluations({ evaluations }: EntryEvaluationsProps) {
  if (!evaluations?.length) return null;

  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">Evaluations</h2>
      <div className="rounded bg-gray-900 p-4">
        <ul className="space-y-4">
          {evaluations.map((evaluation, index) => (
            <li key={evaluation.id + index} className="border-b border-gray-200 pb-2 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <strong>Rating: {evaluation.agreementRating}/5</strong>
                  <span className="ml-4">
                    Choice: Option {evaluation.chosenOptionKey} (
                    {evaluation.wasChosenActuallyAccepted ? 'Accepted' : 'Rejected'})
                  </span>
                </div>
                {/* <span className="text-sm text-gray-500">{evaluation.submittedAt.toLocaleDateString()}</span> */}
              </div>
              {evaluation.comment && <p className="mt-1">{evaluation.comment}</p>}
              {evaluation.categories && (
                <div className="mt-2">
                  <strong className="text-sm">Categories:</strong>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {evaluation.categories.map((category) => (
                      <span key={category} className="rounded-full bg-gray-700 px-2 py-1 text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
