// src/components/landing/StatCard.tsx
'use client';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  changeText?: string;
  changeColor?: string;
  unit?: string;
  className?: string;
  animationDelay?: number; // This can be used by a parent component if needed
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, changeText, changeColor, unit, className }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useScrollAnimation<HTMLDivElement>({ animationClass: 'anim-fade-in-up' });
  const valueRef = useRef<HTMLParagraphElement>(null);

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
          // Count-up animation logic...
          const duration = 1500;
          const startTime = performance.now();

          const animateCount = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            let currentValToSet: string;

            if (progress === 1) {
              if (typeof value === 'string' && String(value) !== String(targetValue)) {
                currentValToSet = value;
              } else {
                currentValToSet = targetValue.toLocaleString();
              }
            } else {
              const currentNum = progress * targetValue;
              currentValToSet = Math.round(currentNum).toLocaleString();
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
  }, [hasAnimated, targetValue, value]);

  return (
    <div ref={cardRef} className={cn('landing-stat-card', className)}>
      <div className="mb-1 flex w-full items-center justify-between">
        <p className="stat-title">{title}</p>
        <div className="stat-icon">{icon}</div>
      </div>
      <p ref={valueRef} className="stat-value mt-1">
        {displayValue}
        {unit && !String(displayValue).includes(unit) && <span className="stat-value-unit">{unit}</span>}
      </p>
      {changeText && <p className={cn('stat-change mt-1', changeColor)}>{changeText}</p>}
    </div>
  );
};

export default StatCard;
