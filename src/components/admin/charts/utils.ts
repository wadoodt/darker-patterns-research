// src/components/admin/charts/utils.ts
import { DemographicsDistribution } from '@/types/stats';
import { chartColors, type ChartDataItem } from './types';

export function transformDistributionData(
  distribution: DemographicsDistribution | undefined,
  nameKey: string = 'name',
  valueKey: string = 'count',
) {
  if (!distribution) return [];
  return Object.entries(distribution)
    .map(([name, value], index) => ({
      [nameKey]: name,
      [valueKey]: value,
      fill: chartColors[index % chartColors.length],
    }))
    .sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]));
}

export function createChartConfig(data: ChartDataItem[], nameField: string) {
  const config: { [key: string]: { label: string; color?: string } } = {
    count: { label: 'Participants' },
  };
  data.forEach((item) => {
    const key = item[nameField];
    if (key != null) {
      config[String(key)] = { label: String(key), color: item.fill };
    }
  });
  return config;
}
