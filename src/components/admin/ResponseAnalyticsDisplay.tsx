// src/components/admin/ResponseAnalyticsDisplay.tsx
'use client';
import type React from 'react';
import type { OverviewStats, ResponseAggregates } from '@/types/stats';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend as RechartsLegend,
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ResponseAnalyticsDisplayProps {
  overviewStats: OverviewStats | null;
  responseAggregates?: ResponseAggregates | null;
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const transformRatingData = (distribution: ResponseAggregates['ratingDistribution'] | undefined) => {
  if (!distribution) return [];
  return Object.entries(distribution)
    .map(([name, value], index) => ({
      name: name.replace('_star', ' Star').replace('star', ' Star'), // Ensure " Star" for all
      count: value,
      fill: chartColors[index % chartColors.length],
    }))
    .sort((a, b) => parseInt(a.name.split(' ')[0]) - parseInt(b.name.split(' ')[0])); // Sort by star number
};

const PieChartCard: React.FC<{
  data: { name: string; value: number; fill: string }[];
  title: string;
  description: string;
  chartConfig: ChartConfig;
}> = ({ data, title, description, chartConfig }) => {
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-dark-text-primary text-base font-medium">{title}</CardTitle>
          <CardDescription className="text-dark-text-tertiary text-xs">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-dark-text-secondary flex h-[250px] items-center justify-center text-sm">
          (No data available)
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-dark-text-primary text-base font-medium">{title}</CardTitle>
        <CardDescription className="text-dark-text-tertiary text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ChartContainer config={chartConfig} className="h-full w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                labelLine={false}
                label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsLegend
                content={<ChartLegendContent nameKey="name" />}
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const ResponseAnalyticsDisplay: React.FC<ResponseAnalyticsDisplayProps> = ({ overviewStats, responseAggregates }) => {
  if (!overviewStats && !responseAggregates) {
    return (
      <p className="text-dark-text-secondary p-4 text-center">
        Response analytics data is not available or still loading.
      </p>
    );
  }

  const ratingData = transformRatingData(responseAggregates?.ratingDistribution);
  const ratingChartConfig: ChartConfig = {
    count: { label: 'Submissions' },
    ...ratingData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as ChartConfig),
  };

  const agreementRate = overviewStats?.agreementRate;
  const commentRate = responseAggregates?.commentSubmissionRatePercent;

  const agreementChartData =
    agreementRate !== undefined
      ? [
          { name: 'Agreed', value: agreementRate, fill: 'hsl(var(--chart-1))' },
          { name: 'Disagreed', value: 100 - agreementRate, fill: 'hsl(var(--chart-3))' },
        ]
      : [];
  const agreementChartConfig = {
    Agreed: { label: 'Agreed', color: 'hsl(var(--chart-1))' },
    Disagreed: { label: 'Disagreed', color: 'hsl(var(--chart-3))' },
  };

  const commentChartData =
    commentRate !== undefined
      ? [
          { name: 'With Comment', value: commentRate, fill: 'hsl(var(--chart-2))' },
          { name: 'No Comment', value: 100 - commentRate, fill: 'hsl(var(--chart-4))' },
        ]
      : [];
  const commentChartConfig = {
    'With Comment': { label: 'With Comment', color: 'hsl(var(--chart-2))' },
    'No Comment': { label: 'No Comment', color: 'hsl(var(--chart-4))' },
  };

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

      {responseAggregates?.ratingDistribution && Object.keys(responseAggregates.ratingDistribution).length > 0 ? (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-dark-text-primary text-base font-medium">
              Evaluation Rating Distribution
            </CardTitle>
            <CardDescription className="text-dark-text-tertiary text-xs">
              Distribution of star ratings given by participants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ratingChartConfig} className="h-[280px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ratingData}
                  layout="horizontal"
                  margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    content={<ChartTooltipContent labelClassName="text-sm" indicator="dot" />}
                  />
                  <Bar dataKey="count" name="Submissions" radius={[4, 4, 0, 0]}>
                    {ratingData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} name={entry.name} />
                    ))}
                  </Bar>
                  {/* <RechartsLegend content={<ChartLegendContent nameKey="name"/>} verticalAlign="top" wrapperStyle={{paddingBottom: "10px"}}/> */}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-dark-text-primary text-base font-medium">
              Evaluation Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-dark-text-secondary flex h-[250px] items-center justify-center text-sm">
            (Rating distribution data not available)
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponseAnalyticsDisplay;
