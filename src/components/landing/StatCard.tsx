// src/components/landing/StatCard.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react'; // Ensure React is explicitly imported
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  changeText?: string;
  changeColor?: string;
  unit?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, changeText, changeColor, unit, className }) => {
  const valueRef = useRef<HTMLParagraphElement>(null);
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);

  // Determine targetValue, handling strings with '+' or other non-numeric parts
  const parseTargetValue = (val: string | number): number => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };
  const targetValue = parseTargetValue(value);

  useEffect(() => {
    const node = valueRef.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          const duration = 1500; // ms
          const startTime = performance.now();

          const animateCount = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            let currentValToSet: string;

            if (progress === 1) {
              // Use original string 'value' if it contains non-numeric parts like '+'
              // Otherwise, format the target number.
              if (typeof value === 'string' && isNaN(parseTargetValue(value))) {
                currentValToSet = value; // e.g. "3+", "N/A"
              } else if (
                typeof value === 'string' &&
                String(value).includes(String(targetValue)) &&
                String(value) !== String(targetValue)
              ) {
                currentValToSet = value; // e.g. "1,234" string input, keep as is
              } else {
                currentValToSet = targetValue.toLocaleString(undefined, {
                  minimumFractionDigits: targetValue % 1 !== 0 ? 2 : 0,
                  maximumFractionDigits: targetValue % 1 !== 0 ? 2 : 0,
                });
              }
            } else {
              const currentNum = progress * targetValue;
              currentValToSet = currentNum.toLocaleString(undefined, {
                minimumFractionDigits: targetValue % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: targetValue % 1 !== 0 ? 2 : 0,
              });
            }
            setDisplayValue(currentValToSet);

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            }
          };
          requestAnimationFrame(animateCount);
          observer.unobserve(node);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      if (node) {
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [targetValue, hasAnimated, value]);

  return (
    <div className={cn('landing-stat-card scroll-animate-item', className)}>
      {' '}
      {/* Added scroll-animate-item for consistency */}
      <div className="mb-1 flex w-full items-center justify-between">
        <p className="text-base font-semibold text-gray-700 sm:text-lg">{title}</p>
        <div className="text-brand-purple-500">{icon}</div>
      </div>
      <p ref={valueRef} className="font-heading-display mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">
        {displayValue}
        {unit && !String(displayValue).includes(unit) && <span className="text-2xl sm:text-3xl">{unit}</span>}
      </p>
      {changeText && <p className={cn('mt-1 text-sm font-medium', changeColor || 'text-gray-500')}>{changeText}</p>}
    </div>
  );
};

export default StatCard;
