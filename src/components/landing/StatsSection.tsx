// components/landing/StatsSection.tsx
import { getCachedStats } from '@/lib/landing/database';
import { Timestamp } from 'firebase/firestore';
import { CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';
import StatCard from '@/components/common/StatCard';

const StatsSection = async () => {
  const statsData = await getCachedStats();

  const lastUpdatedDate = statsData?.lastUpdatedAt
    ? statsData.lastUpdatedAt instanceof Timestamp
      ? statsData.lastUpdatedAt.toDate()
      : new Date(statsData.lastUpdatedAt.seconds * 1000)
    : new Date();

  const statsToDisplay = [
    {
      title: 'Participants Engaged',
      value: statsData?.totalParticipants?.toLocaleString() ?? 'N/A',
      icon: <Users size={24} />,
      changeText: `Updated: ${lastUpdatedDate.toLocaleDateString()}`,
    },
    {
      title: 'Evaluations Submitted',
      value: statsData?.totalEvaluationsSubmitted?.toLocaleString() ?? 'N/A',
      icon: <CheckCircle size={24} />,
    },
    {
      title: 'Avg. Survey Completion',
      value: statsData?.averageCompletionRate ?? 0,
      unit: '%',
      icon: <TrendingUp size={24} />,
      changeColor: 'text-green-500',
    },
    {
      title: 'AI Models Impacted',
      value: `${statsData?.modelsImpacted ?? 0}+`,
      icon: <Zap size={24} />,
    },
  ];

  return (
    <section id="progress" className="section-alt-bg py-16 sm:py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="section-title">Project Progress & Statistics</h2>
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 text-center lg:grid-cols-4">
            {statsToDisplay.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value.toString()}
                icon={stat.icon}
                changeText={stat.changeText}
                changeColor={stat.changeColor}
                unit={stat.unit}
                className="scroll-animate-item"
                animated
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default StatsSection;
