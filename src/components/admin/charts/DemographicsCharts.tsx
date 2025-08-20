'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartableDemographics } from '@/types/dpo';

interface DemographicsChartsProps {
  data: ChartableDemographics;
}

const DemographicsCharts = ({ data }: DemographicsChartsProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Age Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.age} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" name="Participants" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Technical Background</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data.technicalBackground}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" name="Participants" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">AI Familiarity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.aiFamiliarity} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc658" name="Participants" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Education Level</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.education} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#ff8042" name="Participants" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemographicsCharts;
