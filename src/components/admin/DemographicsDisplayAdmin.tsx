// src/components/admin/DemographicsDisplayAdmin.tsx
'use client';
import type React from 'react';
import type { DemographicsSummary, DemographicsDistribution } from '@/types/stats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'; // Removed ChartLegend as it's not directly used
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DemographicsDisplayAdminProps {
  summary: DemographicsSummary | null;
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'oklch(0.627 0.198 253.33)', // Approx Blue 400
  'oklch(0.606 0.17 186.11)', // Approx Teal 400
  'oklch(0.697 0.199 66.82)', // Approx Orange 400
];

const transformDistributionData = (
  distribution: DemographicsDistribution | undefined,
  nameKey: string = 'name',
  valueKey: string = 'count',
) => {
  if (!distribution) return [];
  return Object.entries(distribution)
    .map(([name, value], index) => ({
      [nameKey]: name,
      [valueKey]: value,
      fill: chartColors[index % chartColors.length],
    }))
    .sort((a, b) => b[valueKey] - a[valueKey]);
};

const CustomBarChart: React.FC<{
  data: any[];
  title: string;
  description?: string;
  dataKey: string; // The key for the Y-axis categories (e.g., 'ageGroup')
  barDataKey?: string; // The key for the X-axis values (e.g., 'count')
  chartConfig: ChartConfig;
  layout?: 'horizontal' | 'vertical';
}> = ({ data, title, description, dataKey, barDataKey = 'count', chartConfig, layout = 'vertical' }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-dark-text-primary text-base font-medium">{title}</CardTitle>
          {description && <CardDescription className="text-dark-text-tertiary text-xs">{description}</CardDescription>}
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
        {description && <CardDescription className="text-dark-text-tertiary text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout={layout} margin={{ top: 5, right: 10, left: 10, bottom: 20 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              {layout === 'vertical' ? (
                <>
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis
                    dataKey={dataKey}
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    width={100}
                    interval={0}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={dataKey}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                    interval={0}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                </>
              )}
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                content={<ChartTooltipContent labelClassName="text-sm" indicator="dot" />}
              />
              <Bar
                dataKey={barDataKey}
                radius={layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                barSize={layout === 'vertical' ? undefined : 20}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} name={entry[dataKey]} />
                ))}
              </Bar>
              {/* <Legend content={<ChartLegendContent nameKey={dataKey} />} verticalAlign="top" wrapperStyle={{paddingBottom: "10px"}} /> */}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const DemographicsDisplayAdmin: React.FC<DemographicsDisplayAdminProps> = ({ summary }) => {
  if (!summary) {
    return (
      <p className="text-dark-text-secondary p-4 text-center">Demographics data is not available or still loading.</p>
    );
  }

  const ageData = transformDistributionData(summary.ageGroupDistribution, 'ageGroup');
  const genderData = transformDistributionData(summary.genderDistribution, 'gender');
  const educationData = transformDistributionData(summary.educationDistribution, 'educationLevel');
  const expertiseData = transformDistributionData(summary.expertiseDistribution, 'fieldOfExpertise');
  const aiFamiliarityData = transformDistributionData(summary.aiFamiliarityDistribution, 'aiFamiliarityLevel');

  const createChartConfig = (data: any[], nameField: string): ChartConfig => {
    const config: ChartConfig = { count: { label: 'Participants' } };
    data.forEach((item) => {
      config[item[nameField]] = { label: item[nameField], color: item.fill };
    });
    return config;
  };

  const ageChartConfig = createChartConfig(ageData, 'ageGroup');
  const genderChartConfig = createChartConfig(genderData, 'gender');
  const educationChartConfig = createChartConfig(educationData, 'educationLevel');
  const expertiseChartConfig = createChartConfig(expertiseData, 'fieldOfExpertise');
  const aiFamiliarityChartConfig = createChartConfig(aiFamiliarityData, 'aiFamiliarityLevel');

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <CustomBarChart
        data={ageData}
        title="Age Group Distribution"
        dataKey="ageGroup"
        chartConfig={ageChartConfig}
        layout="vertical"
      />
      <CustomBarChart
        data={genderData}
        title="Gender Distribution"
        dataKey="gender"
        chartConfig={genderChartConfig}
        layout="vertical"
      />
      <CustomBarChart
        data={educationData}
        title="Education Level Distribution"
        dataKey="educationLevel"
        chartConfig={educationChartConfig}
        layout="vertical"
      />
      <CustomBarChart
        data={expertiseData}
        title="Field of Expertise"
        dataKey="fieldOfExpertise"
        chartConfig={expertiseChartConfig}
        layout="vertical"
      />
      <CustomBarChart
        data={aiFamiliarityData}
        title="AI Familiarity"
        dataKey="aiFamiliarityLevel"
        chartConfig={aiFamiliarityChartConfig}
        layout="vertical"
      />

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-dark-text-primary text-base font-medium">
            Total Participants with Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-dark-text-primary text-3xl font-bold">
            {summary.totalParticipantsWithDemographics?.toLocaleString() || 'N/A'}
          </p>
          {summary.lastUpdatedAt && (
            <p className="text-dark-text-tertiary mt-1 text-xs">
              Last updated: {new Date((summary.lastUpdatedAt as any).seconds * 1000).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemographicsDisplayAdmin;
