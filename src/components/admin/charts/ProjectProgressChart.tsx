'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProjectProgressDataPoint } from '@/types/dpo';

interface ProjectProgressChartProps {
  data: ProjectProgressDataPoint[];
}

const ProjectProgressChart = ({ data }: ProjectProgressChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Entries Completed" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProjectProgressChart;
