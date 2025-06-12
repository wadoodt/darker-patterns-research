'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import React from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  height?: string;
  children?: React.ReactElement;
  chartConfig: ChartConfig;
}

export function ChartCard({ title, description, height = '280px', children, chartConfig }: ChartCardProps) {
  if (!children) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-dark-text-primary text-base font-medium">{title}</CardTitle>
          {description && <CardDescription className="text-dark-text-tertiary text-xs">{description}</CardDescription>}
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
        {description && <CardDescription className="text-dark-text-tertiary text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={`h-[${height}] w-full text-xs`}>
          {children}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
