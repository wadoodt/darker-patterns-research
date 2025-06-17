// src/components/admin/charts/DemographicsBarChart.tsx
'use client';

import { ChartTooltipContent } from '@/components/ui/chart';
import type { DemographicsBarChartProps } from '@/types/charts';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from './ChartCard';

export function DemographicsBarChart({
  data,
  title,
  description,
  dataKey,
  barDataKey = 'count',
  chartConfig,
  layout = 'vertical',
}: DemographicsBarChartProps) {
  if (!data?.length) {
    return <ChartCard title={title} description={description} chartConfig={chartConfig} />;
  }

  return (
    <ChartCard title={title} description={description} chartConfig={chartConfig}>
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
              <Cell key={`cell-${index}`} fill={entry.fill as string} name={String(entry[dataKey])} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
