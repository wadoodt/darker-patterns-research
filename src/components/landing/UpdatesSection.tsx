// components/landing/UpdatesSection.tsx
import type React from 'react';
import UpdateItem from './UpdateItem';
import { BarChartBig, Milestone, Users2, CalendarDays, Newspaper } from 'lucide-react';
import { db } from '@/lib/firebase'; // Adjusted path
import { doc, getDoc, Timestamp } from 'firebase/firestore'; // Changed from "type Timestamp"

interface LandingUpdate {
  id: string;
  title: string;
  date: Timestamp | { seconds: number; nanoseconds: number };
  description: string;
  iconName?: string;
}

interface AdminSettings {
  landingPageUpdates?: LandingUpdate[];
}

const mockUpdatesData: LandingUpdate[] = [
  {
    id: 'mock-update-1',
    title: 'Test Mode: Project Kickoff!',
    date: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
    description: 'This is a mock update for test environment. The DPV project has officially started.',
    iconName: 'Milestone',
  },
  {
    id: 'mock-update-2',
    title: 'Test Mode: Alpha Version Released',
    date: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    description: 'Alpha version is now available for internal testing. Features include X, Y, Z.',
    iconName: 'Newspaper',
  },
];

async function getLandingUpdates(): Promise<LandingUpdate[]> {
  if (process.env.NODE_ENV === 'test' || !db) {
    console.log('UpdatesSection: Test mode or DB not available, returning mock updates.');
    return mockUpdatesData.sort((a, b) => b.date.seconds - a.date.seconds);
  }
  try {
    const settingsDocRef = doc(db, 'admin_settings', 'global_config');
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      const settings = docSnap.data() as AdminSettings;
      const updates = settings.landingPageUpdates || [];
      return updates.sort((a, b) => {
        const dateA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date.seconds * 1000).getTime();
        const dateB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date.seconds * 1000).getTime();
        return dateB - dateA;
      });
    }
    console.warn('UpdatesSection: No admin_settings/global_config document found! Returning mock data.');
    return mockUpdatesData.sort((a, b) => b.date.seconds - a.date.seconds);
  } catch (error) {
    console.error('UpdatesSection: Error fetching landing updates:', error);
    return mockUpdatesData.sort((a, b) => b.date.seconds - a.date.seconds);
  }
}

const iconMap: { [key: string]: React.ElementType } = {
  BarChartBig: BarChartBig,
  Milestone: Milestone,
  Users2: Users2,
  Newspaper: Newspaper,
  default: CalendarDays,
};

const UpdatesSection = async () => {
  const updates = await getLandingUpdates();

  return (
    <section id="updates" className="bg-dark-bg-secondary py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h2 className="font-heading-display text-dark-text-primary text-glow-landing-alt mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Project Updates & News
        </h2>
        {updates.length > 0 ? (
          <div className="space-y-8 sm:space-y-10">
            {updates.map((update, index) => {
              const IconComponent = update.iconName
                ? iconMap[update.iconName] || iconMap['default']
                : iconMap['default'];
              const dateObject =
                update.date instanceof Timestamp ? update.date.toDate() : new Date(update.date.seconds * 1000);
              return (
                <UpdateItem
                  key={update.id || update.title}
                  title={update.title}
                  date={dateObject.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  description={update.description}
                  icon={<IconComponent size={14} />}
                  animationDelay={`${index * 100}ms`} // Example of staggering animation
                />
              );
            })}
          </div>
        ) : (
          <p className="text-dark-text-secondary text-center">No updates posted yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
};
export default UpdatesSection;
