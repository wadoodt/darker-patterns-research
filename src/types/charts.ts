// src/types/charts.ts
import type React from 'react';
import type { ChartConfig } from '@/components/ui/chart.types';

export type { ChartConfig }; // Re-exporting

export const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'oklch(0.627 0.198 253.33)', // Approx Blue 400
  'oklch(0.606 0.17 186.11)', // Approx Teal 400
  'oklch(0.697 0.199 66.82)', // Approx Orange 400
];

export interface ChartDataItem {
  name: string;
  fill: string;
  value?: number;
  count?: number;
  [key: string]: string | number | undefined;
}

export interface PieChartData extends Omit<ChartDataItem, 'value'> {
  value: number;
}

export interface BarChartData extends Omit<ChartDataItem, 'count'> {
  count: number;
}

export interface ChartCardBaseProps {
  title: string;
  description?: string;
  chartConfig: ChartConfig;
}

export interface DemographicsBarChartProps extends ChartCardBaseProps {
  data: BarChartData[];
  dataKey: string;
  barDataKey?: string;
  layout?: 'horizontal' | 'vertical';
}

export interface PieChartCardProps extends ChartCardBaseProps {
  data: PieChartData[];
}

export interface ChartCardProps extends ChartCardBaseProps {
  height?: string;
  children?: React.ReactElement;
}
