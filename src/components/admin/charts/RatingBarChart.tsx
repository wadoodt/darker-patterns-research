'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/types/charts';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { BarChartData } from '@/types/charts';

interface RatingBarChartProps {
  data: BarChartData[];
  chartConfig: ChartConfig;
}

export function RatingBarChart({ data, chartConfig }: RatingBarChartProps) {
  if (!data?.length) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-dark-text-primary text-base font-medium">Evaluation Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="text-dark-text-secondary flex h-[250px] items-center justify-center text-sm">
          (Rating distribution data not available)
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-dark-text-primary text-base font-medium">Evaluation Rating Distribution</CardTitle>
        <CardDescription className="text-dark-text-tertiary text-xs">
          Distribution of star ratings given by participants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 10, left: 10, bottom: 20 }} barSize={30}>
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
              <Bar dataKey="count" name="Submissions" radius={[4, 4, 0, 0]} fill="#82ca9d">
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.fill as string}
                    name={String(entry.name)} // Ensure name is always a string
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
