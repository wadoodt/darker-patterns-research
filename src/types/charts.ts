// types/charts.ts
import type { ChartConfig } from '@/components/ui/chart.types';

export interface ChartDataItem {
  name: string; // Required for all chart items
  fill: string; // Required for all charts
  value?: number; // For pie charts
  count?: number; // For bar charts
  [key: string]: string | number | undefined; // Allow additional properties
}

export interface PieChartData extends Omit<ChartDataItem, 'value'> {
  value: number; // Make value required for pie charts
}

export interface BarChartData extends Omit<ChartDataItem, 'count'> {
  count: number; // Make count required for bar charts
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
