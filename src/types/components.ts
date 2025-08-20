// types/components.ts
import type { ElementType, ReactNode } from 'react';

// Base props shared between different card components
interface BaseCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export interface StatCardProps extends BaseCardProps {
  icon?: ElementType;
  iconColorClass?: string;
  change?: string;
}

export interface StatCardAdminProps extends BaseCardProps {
  icon?: ReactNode;
  valueSecondary?: string | ReactNode;
  valueSecondaryColor?: string;
  progressPercent?: number;
  progressColor?: string;
  footerText?: string;
  footerIcon?: ReactNode;
  footerColor?: string;
}

// Demographics chart types
export interface DemoDataItem {
  range?: string;
  label?: string;
  percent: number;
  color: string;
}

export interface DemoChartAdminProps {
  ageData: DemoDataItem[];
  techBgData: DemoDataItem[];
  className?: string;
}
