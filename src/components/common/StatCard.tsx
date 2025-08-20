// src/components/common/StatCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCountUpAnimation } from '@/hooks/useCountUpAnimation';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

import React from 'react';
import type { StatCardProps } from './StatCard.types';

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColorClass,
  changeText,
  changeColor,
  unit,
  className,
  animated = false,
}) => {
  const parseTargetValue = (val: string | number): number => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  const targetValue = parseTargetValue(value);
  const { displayValue, ref: valueRef } = useCountUpAnimation({
    targetValue,
    animated,
    initialValue: value,
  });

  const cardRef = useScrollAnimation<HTMLDivElement>({
    animationClass: 'anim-fade-in-up',
    triggerOnce: true,
  });

  const renderIcon = () => {
    if (!Icon) {
      return null;
    }

    // Icon is a ReactElement, e.g., <Users />
    if (React.isValidElement(Icon)) {
      const iconElement = Icon as React.ReactElement<{ className?: string }>;
      return React.cloneElement(iconElement, {
        className: cn('h-5 w-5', iconColorClass, iconElement.props.className),
      });
    }

    // Icon is a component type, e.g., BookOpen
    if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null && 'render' in Icon)) {
      const IconComponent = Icon as React.ElementType;
      return <IconComponent className={cn('h-5 w-5', iconColorClass)} />;
    }

    // Fallback for other ReactNode types like string, though our prop type is stricter now.
    return <div className="stat-icon">{Icon as React.ReactNode}</div>;
  };

  return (
    <Card
      ref={animated ? cardRef : null}
      className={cn('shadow-lg transition-shadow duration-300 hover:shadow-xl', className)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div ref={valueRef} className="text-foreground text-3xl font-bold">
          {displayValue}
          {unit && !String(displayValue).includes(unit) && <span className="stat-value-unit">{unit}</span>}
        </div>
        {changeText && <p className={cn('text-muted-foreground text-xs', changeColor)}>{changeText}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
