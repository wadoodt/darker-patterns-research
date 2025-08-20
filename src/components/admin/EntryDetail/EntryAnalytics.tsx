import type { EntryWithDetails } from '@/types/entryDetails';

interface EntryAnalyticsProps {
  entry: EntryWithDetails;
}

function BasicStats({ entry }: EntryAnalyticsProps) {
  return (
    <>
      <div>
        <strong>Review Count:</strong> {entry.reviewCount}
      </div>
      <div>
        <strong>Target Reviews:</strong> {entry.targetReviewCount || 'Not set'}
      </div>
      <div>
        <strong>Flag Count:</strong> {entry.isFlaggedCount || 0}
      </div>
      {entry.analytics && (
        <>
          <div>
            <strong>Views:</strong> {entry.analytics.views}
          </div>
          <div>
            <strong>Total Evals:</strong> {entry.analytics.totalEvaluations}
          </div>
          <div>
            <strong>Avg. Rating:</strong> {entry.analytics.averageRating.toFixed(2)}
          </div>
          <div>
            <strong>Correctness:</strong> {entry.analytics.correctness.toFixed(1)}%
          </div>
        </>
      )}
    </>
  );
}

function ResponseStats({ analytics }: { analytics: NonNullable<EntryWithDetails['analytics']> }) {
  const ratingDistribution = analytics.ratingDistribution || {};
  return (
    <>
      <div>
        <strong>Rating Distribution:</strong>
        <div className="mt-1 flex gap-2 text-sm">
          {Object.entries(ratingDistribution)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-1">
                <span>{rating}★</span>
                <span>{count}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

function CategoryStats({ entry }: EntryAnalyticsProps) {
  const categoryDistribution = entry.analytics?.categoryDistribution;
  if (!categoryDistribution || Object.keys(categoryDistribution).length === 0) return null;

  const originalCategories = entry.categories || [];

  const sortedCategories = Object.entries(categoryDistribution).sort(([, a], [, b]) => b - a);

  return (
    <div className="mt-6 border-t border-gray-700 pt-6">
      <h3 className="mb-4 text-lg font-semibold">Category Analysis</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold">Original Categories</h4>
          <div className="flex flex-wrap gap-2">
            {originalCategories.map((category) => (
              <span key={category} className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                {category}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Participant Selections</h4>
          <ul className="space-y-2">
            {sortedCategories.map(([category, count]) => (
              <li key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-medium">{count} vote(s)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DemographicsStats({ demographics }: { demographics: NonNullable<EntryWithDetails['demographics']> }) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="mb-4 text-lg font-semibold">Participant Demographics</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(demographics).map(([key, distribution]) => {
          if (!distribution || key === 'lastUpdatedAt' || key === 'totalParticipantsWithDemographics') return null;
          const distributionType = key.replace('Distribution', '');

          // Convert distribution object to array and sort by count
          const items = Object.entries(distribution)
            .map(([label, count]) => ({ label, count: Number(count) }))
            .sort((a, b) => b.count - a.count);

          const total = items.reduce((sum, item) => sum + item.count, 0);

          return (
            <div key={key} className="demographics-item">
              <h4 className="mb-2 text-sm font-medium capitalize">{distributionType}</h4>
              {items.map(({ label, count }) => {
                const percentage = (count / total) * 100;
                return (
                  <div key={label} className="demographics-label-percent">
                    <span className="demographics-label">{label}</span>
                    <span className="demographics-percent">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EntryAnalytics({ entry }: EntryAnalyticsProps) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">Entry Analytics</h2>
      <div className="rounded bg-gray-900 p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <BasicStats entry={entry} />
          {entry.analytics && <ResponseStats analytics={entry.analytics} />}
        </div>
        {entry.analytics && <CategoryStats entry={entry} />}
        {entry.demographics && <DemographicsStats demographics={entry.demographics} />}
      </div>
    </section>
  );
}
