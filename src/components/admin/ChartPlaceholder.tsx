// src/components/admin/ChartPlaceholder.tsx
import type React from 'react';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react'; // Default icon

interface ChartPlaceholderProps {
  description?: string;
  height?: string; // e.g., 'h-72'
  icon?: React.ReactNode;
  className?: string;
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  description,
  height = 'h-64', // Default height
  icon,
  className,
}) => {
  return (
    <div className={cn('chart-placeholder', height, className)}>
      <div className="chart-placeholder-icon">{icon || <BarChart3 size={48} />}</div>
      <p className="chart-placeholder-text">Chart data will be displayed here.</p>
      {description && <p className="chart-placeholder-desc">{description}</p>}
    </div>
  );
};

export default ChartPlaceholder;
