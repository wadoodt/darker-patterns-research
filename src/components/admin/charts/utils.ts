// src/components/admin/charts/utils.ts
'use client';

import { ChartDataItem } from '@/types/charts';
import { DemographicsDistribution } from '@/types/stats';
import { chartColors, type ChartConfig } from '@/types/charts';

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

export function transformRatingData(distribution: Record<string, number> | undefined) {
  if (!distribution) return [];
  return Object.entries(distribution)
    .map(([name, value], index) => ({
      name: name.replace('_star', ' Star').replace('star', ' Star'),
      count: value,
      fill: chartColors[index % chartColors.length],
    }))
    .sort((a, b) => parseInt(a.name.split(' ')[0]) - parseInt(b.name.split(' ')[0]));
}

export function createPieChartData(
  value: number | undefined,
  label1: string,
  label2: string,
  color1: string,
  color2: string,
) {
  if (value === undefined) return [];
  return [
    { name: label1, value: value, fill: color1 },
    { name: label2, value: 100 - value, fill: color2 },
  ];
}

export function createPieChartConfig(label1: string, label2: string, color1: string, color2: string): ChartConfig {
  return {
    [label1]: { label: label1, color: color1 },
    [label2]: { label: label2, color: color2 },
  };
}

export function createRatingChartConfig(ratingData: Array<{ name: string; fill: string }>): ChartConfig {
  return {
    count: { label: 'Submissions' },
    ...ratingData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as ChartConfig),
  };
}
