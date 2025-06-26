// src/types/charts.ts
import type { ChartConfig } from '@/components/ui/chart.types';
import type React from 'react';

export type { ChartConfig }; // Re-exporting

export const chartColors = [
  'oklch(0.627 0.265 303.9)',
  'oklch(0.715 0.143 215.221)',
  'oklch(0.606 0.25 292.717)',
  'oklch(0.656 0.241 354.308)',
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
