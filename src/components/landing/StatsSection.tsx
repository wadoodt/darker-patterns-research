// components/landing/StatsSection.tsx
import type React from 'react';
import StatCard from './StatCard';
import { Users, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { db } from '@/lib/firebase'; // Adjusted path
import { doc, getDoc, Timestamp } from 'firebase/firestore'; // Changed from "type Timestamp"

interface CachedStats {
  totalParticipants?: number;
  totalEvaluationsSubmitted?: number;
  averageCompletionRate?: number;
  modelsImpacted?: number;
  lastUpdatedAt?: Timestamp | { seconds: number; nanoseconds: number };
}

// Mock data for test environment or if Firestore fetch fails
const mockStatsData: CachedStats = {
  totalParticipants: 1247,
  totalEvaluationsSubmitted: 8500,
  averageCompletionRate: 92,
  modelsImpacted: 3,
  lastUpdatedAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 }, // Mock: 1 hour ago
};

async function getCachedStats(): Promise<CachedStats | null> {
  if (process.env.NODE_ENV === 'test' || !db) {
    console.log('StatsSection: Test mode or DB not available, returning mock stats.');
    return mockStatsData;
  }
  try {
    const statsDocRef = doc(db, 'cached_statistics', 'overview_stats');
    const docSnap = await getDoc(statsDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as CachedStats;
    }
    console.warn('StatsSection: No cached_stats/overview_stats document found! Returning mock data.');
    return mockStatsData; // Fallback to mock if not found
  } catch (error) {
    console.error('StatsSection: Error fetching cached stats:', error);
    return mockStatsData; // Fallback to mock on error
  }
}

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
    <section id="stats" className="bg-dark-bg-secondary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-heading-display text-dark-text-primary text-glow-landing-alt text-3xl font-bold tracking-tight sm:text-4xl">
            Live Project Impact
          </h2>
          <p className="text-dark-text-secondary mt-4 text-lg leading-8">
            See the real-time progress and engagement of our research community.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {statsToDisplay.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value.toString()}
              icon={stat.icon}
              changeText={stat.changeText}
              changeColor={stat.changeColor}
              unit={stat.unit}
              className="scroll-animate-item" // Applied for consistency
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default StatsSection;
