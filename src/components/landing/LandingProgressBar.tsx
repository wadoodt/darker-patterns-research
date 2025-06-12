// src/components/landing/LandingProgressBar.tsx
'use client';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import React, { useEffect, useState } from 'react';

interface LandingProgressBarProps {
  label: string;
  percentage: number;
  colorClass?: string;
}

const LandingProgressBar: React.FC<LandingProgressBarProps> = ({
  label,
  percentage,
  colorClass = 'bg-brand-purple-500',
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const barRef = useScrollAnimation({ animationClass: 'anim-fade-in-up' });

  useEffect(() => {
    const node = barRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPercentage(percentage);
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
  }, [percentage, barRef]);

  return (
    <div ref={barRef}>
      <div className="text-dark-text-secondary mb-1 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-dark-text-primary font-semibold">{percentage}%</span>
      </div>
      <div className="bg-dark-bg-tertiary h-3 overflow-hidden rounded-full shadow-inner sm:h-4">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${currentPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LandingProgressBar;
