// src/components/admin/ActivityItem.tsx
import type React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
  time: string;
  actionText?: string;
  actionLink?: string;
  className?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, text, time, actionText, actionLink, className }) => {
  return (
    <li className={cn('activity-item', className)}>
      <div className="activity-item-content">
        {icon && <span className="activity-item-icon-wrapper">{icon}</span>}
        <div>
          <p className="activity-item-text-primary">{text}</p>
          <p className="activity-item-text-secondary">{time}</p>
        </div>
      </div>
      {actionText && actionLink && (
        <Link href={actionLink} className="activity-item-action-link">
          {actionText}
        </Link>
      )}
    </li>
  );
};

export default ActivityItem;
