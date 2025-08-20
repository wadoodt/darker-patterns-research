// src/components/common/StatCard.types.ts
import type { ElementType, ReactElement } from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ElementType | ReactElement;
  iconColorClass?: string;
  change?: string;
  changeText?: string;
  changeColor?: string;
  unit?: string;
  className?: string;
  animated?: boolean;
  animationDelay?: number;
}
