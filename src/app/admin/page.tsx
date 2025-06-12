'use client';

import ActivityItem from '@/components/admin/ActivityItem';
import { ChartCard } from '@/components/admin/ChartCard';
import ChartPlaceholder from '@/components/admin/ChartPlaceholder';
import { StatCard } from '@/components/admin/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, BarChart, CheckCircle, LineChart, PieChart, Users } from 'lucide-react';

const ACTIVITY_ITEMS = [
  {
    icon: <CheckCircle className="text-green-500" />,
    text: 'New submission #1235 approved',
    time: '2 hours ago by @researcher_jane',
  },
  {
    icon: <AlertTriangle className="text-yellow-500" />,
    text: 'Pattern "Roach Motel" definition updated',
    time: '5 hours ago by @admin_mike',
  },
  {
    icon: <Users className="text-blue-500" />,
    text: 'New user "contributor_sam" registered',
    time: '1 day ago',
  },
] as const;

const STAT_CARDS = [
  {
    title: 'Total Submissions',
    value: '1,234',
    change: '+20.1% from last month',
    icon: BarChart,
    iconColorClass: 'text-primary',
  },
  {
    title: 'Registered Users',
    value: '258',
    change: '+15 since last week',
    icon: Users,
    iconColorClass: 'text-accent',
  },
  {
    title: 'Patterns Identified',
    value: '78',
    change: 'Across 12 categories',
    icon: AlertTriangle,
    iconColorClass: 'text-destructive',
  },
] as const;

export default function AdminDashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto py-2">
      <div className="mb-8">
        <h1 className="font-headline text-foreground text-4xl font-bold">
          Welcome, <span className="text-primary">{profile?.displayName || 'Admin'}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">Here&apos;s an overview of the Dark Pattern Validator.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ChartCard title="Submission Trends" description="Monthly submissions over the last year" colSpan={3}>
          <ChartPlaceholder
            icon={<LineChart size={48} />}
            height="h-[350px]"
            description="Visualizing submission trends over time"
          />
        </ChartCard>

        <ChartCard title="Pattern Distribution" description="Breakdown of identified dark patterns by type" colSpan={2}>
          <ChartPlaceholder
            icon={<PieChart size={48} />}
            height="h-[350px]"
            description="Distribution of dark pattern categories"
          />
        </ChartCard>
      </div>
      <ChartCard title="Recent Activity" className="mt-8">
        <ul className="space-y-3">
          {ACTIVITY_ITEMS.map((item) => (
            <ActivityItem key={item.text} {...item} />
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}
