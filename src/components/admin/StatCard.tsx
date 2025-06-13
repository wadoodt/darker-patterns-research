// src/components/admin/StatCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatCardProps } from '@/types/components';

export function StatCard({ title, value, icon: Icon, iconColorClass, change, className }: StatCardProps) {
  return (
    <Card className={cn('shadow-lg transition-shadow duration-300 hover:shadow-xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={cn('h-5 w-5', iconColorClass)} />}
      </CardHeader>
      <CardContent>
        <div className="text-foreground text-3xl font-bold">{value}</div>
        {change && <p className="text-muted-foreground text-xs">{change}</p>}
      </CardContent>
    </Card>
  );
}
