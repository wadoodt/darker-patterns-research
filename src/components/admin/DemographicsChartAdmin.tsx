// src/components/admin/DemographicsChartAdmin.tsx
import { cn } from '@/lib/utils';
import type { DemoChartAdminProps, DemoDataItem } from '@/types/components';
import type React from 'react';

const DemographicsChartAdmin: React.FC<DemoChartAdminProps> = ({ ageData, techBgData, className }) => {
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
