// src/components/admin/StatCardAdmin.tsx
import { cn } from '@/lib/utils';
import type { StatCardAdminProps } from '@/types/components';
import type React from 'react';

const StatCardAdmin: React.FC<StatCardAdminProps> = ({
  title,
  value,
  valueSecondary,
  valueSecondaryColor = 'text-dark-text-secondary',
  icon,
  progressPercent,
  progressColor = 'bg-brand-purple-500',
  footerText,
  footerIcon,
  footerColor = 'text-dark-text-secondary',
  className,
}) => {
  return (
    <div className={cn('admin-card', className)}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="stat-card-title">{title}</h3>
        {icon && <div className="stat-card-icon-wrapper">{icon}</div>}
      </div>

      <div className="mb-1 flex items-baseline">
        <p className="stat-card-value">{value}</p>
        {valueSecondary && (
          <span className={cn('stat-card-value-secondary', valueSecondaryColor)}>{valueSecondary}</span>
        )}
      </div>

      {progressPercent !== undefined && (
        <div className="stat-card-progress-track">
          <div className={cn('stat-card-progress-fill', progressColor)} style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      {footerText && (
        <div className={cn('stat-card-footer', footerColor)}>
          {footerIcon && <span className="stat-card-footer-icon">{footerIcon}</span>}
          <span>{footerText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCardAdmin;
