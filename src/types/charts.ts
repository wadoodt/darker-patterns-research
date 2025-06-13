// types/charts.ts
import type { ChartConfig } from '@/components/ui/chart.types';

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface PieChartData extends ChartDataItem {
  [key: string]: unknown; // For flexible key-value pairs
}

export interface BarChartData extends ChartDataItem {
  count: number;
  [key: string]: unknown; // For flexible key-value pairs
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
