import type { EntryWithDetails } from '@/types/entryDetails';
import type { ResponseAggregates } from '@/types/stats';

const RATING_KEYS = ['5_star', '4_star', '3_star', '2_star', '1_star'] as const;

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
            <strong>Upvotes:</strong> {entry.analytics.upvotes}
          </div>
        </>
      )}
    </>
  );
}

function ResponseStats({ responseAggregates }: { responseAggregates: ResponseAggregates }) {
  return (
    <>
      <div>
        <strong>Comment Rate:</strong> {responseAggregates.commentSubmissionRatePercent?.toFixed(1)}%
      </div>
      <div>
        <strong>Comment Count:</strong> {responseAggregates.commentSubmissions || 0}
      </div>
      <div>
        <strong>Rating Distribution:</strong>
        <div className="mt-1 flex gap-2 text-sm">
          {RATING_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-1">
              <span>{key.charAt(0)}★</span>
              <span>{responseAggregates.ratingDistribution?.[key] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </>
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
          {entry.responseAggregates && <ResponseStats responseAggregates={entry.responseAggregates} />}
        </div>
        {entry.demographics && <DemographicsStats demographics={entry.demographics} />}
      </div>
    </section>
  );
}
