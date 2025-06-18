// src/components/admin/ResponseAnalyticsDisplay.tsx
'use client';

import type { OverviewStats, ResponseAggregates } from '@/types/stats';
import { PieChartCard } from './charts/PieChartCard';
import { RatingBarChart } from './charts/RatingBarChart';
import { createPieChartConfig, createPieChartData, createRatingChartConfig, transformRatingData } from './charts/utils';

interface ResponseAnalyticsDisplayProps {
  overviewStats: OverviewStats | null;
  responseAggregates?: ResponseAggregates | null;
}

export default function ResponseAnalyticsDisplay({ overviewStats, responseAggregates }: ResponseAnalyticsDisplayProps) {
  if (!overviewStats && !responseAggregates) {
    return (
      <p className="text-dark-text-secondary p-4 text-center">
        Response analytics data is not available or still loading.
      </p>
    );
  }

  const ratingData = transformRatingData(responseAggregates?.ratingDistribution);
  const ratingChartConfig = createRatingChartConfig(ratingData);

  const agreementRate = overviewStats?.agreementRate;
  const commentRate = responseAggregates?.commentSubmissionRatePercent;

  const agreementChartData = createPieChartData(
    agreementRate,
    'Agreed',
    'Disagreed',
    'hsl(var(--chart-1))',
    'hsl(var(--chart-3))',
  );
  const agreementChartConfig = createPieChartConfig(
    'Agreed',
    'Disagreed',
    'hsl(var(--chart-1))',
    'hsl(var(--chart-3))',
  );

  const commentChartData = createPieChartData(
    commentRate,
    'With Comment',
    'No Comment',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-4))',
  );
  const commentChartConfig = createPieChartConfig(
    'With Comment',
    'No Comment',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-4))',
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <PieChartCard
        data={agreementChartData}
        title="Overall Agreement Rate"
        description="Percentage of evaluations matching researcher preference."
        chartConfig={agreementChartConfig}
      />
      <PieChartCard
        data={commentChartData}
        title="Comment Submission Rate"
        description="Percentage of evaluations that included a comment."
        chartConfig={commentChartConfig}
      />

      <RatingBarChart data={ratingData} chartConfig={ratingChartConfig} />
    </div>
  );
}
