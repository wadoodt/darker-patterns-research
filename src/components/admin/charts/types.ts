// src/components/admin/charts/types.ts
import type { ChartConfig } from '@/components/ui/chart';

export interface ChartDataItem {
  [key: string]: string | number | undefined;
  fill: string;
}

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

export type { ChartConfig };
