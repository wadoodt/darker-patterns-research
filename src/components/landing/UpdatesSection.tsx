// components/landing/UpdatesSection.tsx
import { db } from '@/lib/firebase'; // Adjusted path
import { doc, getDoc, Timestamp } from 'firebase/firestore'; // Changed from "type Timestamp"
import { BarChartBig, CalendarDays, Milestone, Newspaper, Users2 } from 'lucide-react';
import type React from 'react';
import UpdateList from './UpdateList';

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
    <section id="updates" className="section-alt-bg py-16 sm:py-24">
      <div className="section-container max-w-3xl">
        <h2 className="section-title">Project Updates & News</h2>
        {updates.length > 0 ? (
          <UpdateList updates={updates} />
        ) : (
          <p className="text-dark-text-secondary text-center">No updates posted yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
};
export default UpdatesSection;
