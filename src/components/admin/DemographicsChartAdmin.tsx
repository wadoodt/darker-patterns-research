// src/components/admin/DemographicsChartAdmin.tsx
import type React from 'react';
import { cn } from '@/lib/utils';

interface DemoDataItem {
  range?: string; // For age
  label?: string; // For tech background
  percent: number;
  color: string; // Tailwind background color class e.g. 'bg-brand-purple-500'
}

interface DemographicsChartAdminProps {
  ageData: DemoDataItem[];
  techBgData: DemoDataItem[];
  className?: string;
}

const DemographicsChartAdmin: React.FC<DemographicsChartAdminProps> = ({ ageData, techBgData, className }) => {
  const renderDemographicItem = (item: DemoDataItem, index: number) => (
    <div key={index} className="demographics-item">
      <div className="demographics-label-percent">
        <span className="demographics-label">{item.range || item.label}</span>
        <span className="demographics-percent">{item.percent}%</span>
      </div>
      <div className="demographics-bar-track">
        <div className={cn('demographics-bar-fill', item.color)} style={{ width: `${item.percent}%` }} />
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-5', className)}>
      {' '}
      {/* Increased spacing between sections */}
      <div>
        <h4 className="text-dark-text-primary mb-2 text-sm font-semibold">Age Groups</h4>
        <div className="space-y-2">{ageData.map(renderDemographicItem)}</div>
      </div>
      <div>
        <h4 className="text-dark-text-primary mb-2 text-sm font-semibold">Technical Background</h4>
        <div className="space-y-2">{techBgData.map(renderDemographicItem)}</div>
      </div>
    </div>
  );
};

export default DemographicsChartAdmin;
