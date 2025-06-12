'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  fill: string;
}

interface PieChartCardProps {
  data: PieChartData[];
  title: string;
  description: string;
  chartConfig: ChartConfig;
}

export function PieChartCard({ data, title, description, chartConfig }: PieChartCardProps) {
  if (!data?.length || data.every((d) => d.value === 0)) {
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
              <Legend
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
}
