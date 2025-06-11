// src/components/landing/LandingProgressBar.tsx
import type React from 'react';

interface LandingProgressBarProps {
  label: string;
  percentage: number;
  colorClass?: string;
}

const LandingProgressBar: React.FC<LandingProgressBarProps> = ({
  label,
  percentage,
  colorClass = 'bg-brand-purple-500',
}) => (
  <div className="scroll-animate-item">
    <div className="text-dark-text-secondary mb-1 flex justify-between text-sm font-medium">
      <span>{label}</span>
      <span className="text-dark-text-primary font-semibold">{percentage}%</span>
    </div>
    <div className="bg-dark-bg-tertiary h-3 overflow-hidden rounded-full shadow-inner sm:h-4">
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default LandingProgressBar;
