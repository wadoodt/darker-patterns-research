import type { LandingUpdate } from '@/components/landing/types';
import { db } from '@/lib/firebase';
import type { LandingStats } from '@/types/stats';
import { collection, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';

// Mock data for test environment or if Firestore fetch fails
const mockStatsData: LandingStats = {
  totalParticipants: 1247,
  totalEvaluationsSubmitted: 8500,
  averageCompletionRate: 92,
  modelsImpacted: 3,
  lastUpdatedAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 },
};

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

interface AdminSettings {
  landingPageUpdates?: LandingUpdate[];
}

export async function getCachedStats(): Promise<LandingStats | null> {
  if (process.env.NODE_ENV === 'test' || !db) {
    console.warn('StatsSection: Test mode or DB not available, returning mock stats.');
    return mockStatsData;
  }
  try {
    const statsDocRef = doc(db, 'cached_statistics', 'overview_stats');
    const docSnap = await getDoc(statsDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as LandingStats;
    }
    console.warn('StatsSection: No cached_stats/overview_stats document found! Returning mock data.');
    return mockStatsData;
  } catch (error) {
    console.error('StatsSection: Error fetching cached stats:', error);
    return mockStatsData;
  }
}

export async function getProjectProgress(): Promise<{ label: string; percentage: number; colorClass: string }[]> {
  if (!db) throw new Error('Firebase is not initialized');
  const colorClasses = ['bg-brand-purple-500', 'bg-accent-cyan', 'bg-accent-pink'];
  const entriesSnapshot = await getDocs(collection(db, 'dpo_entries'));
  const entries = entriesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as import('@/types/dpo').DPOEntry[];
  const totalEntries = entries.length;
  const annotatedEntries = entries.filter((e) => (e.reviewCount ?? 0) > 0).length;
  const overallAnnotationPercent = totalEntries > 0 ? Math.round((annotatedEntries / totalEntries) * 100) : 0;
  const entriesWith10Reviews = entries.filter((e) => (e.reviewCount ?? 0) >= 10).length;
  const min10ReviewsPercent = totalEntries > 0 ? Math.round((entriesWith10Reviews / totalEntries) * 100) : 0;
  let ethicsCoveragePercent = 0;
  try {
    const evalsSnapshot = await getDocs(collection(db, 'evaluations'));
    const evals = evalsSnapshot.docs.map((doc) => doc.data());
    const entryIdsWithEthics = new Set(evals.filter((ev) => ev.isEthicsOrSafety).map((ev) => ev.dpoEntryId));
    ethicsCoveragePercent = totalEntries > 0 ? Math.round((entryIdsWithEthics.size / totalEntries) * 100) : 0;
  } catch {
    ethicsCoveragePercent = 0;
  }
  return [
    { label: 'Overall Dataset Annotation', percentage: overallAnnotationPercent, colorClass: colorClasses[0] },
    { label: 'Ethics & Safety Review Coverage', percentage: ethicsCoveragePercent, colorClass: colorClasses[1] },
    { label: 'Min. 10 Reviews per Entry Target', percentage: min10ReviewsPercent, colorClass: colorClasses[2] },
  ];
}

export async function getLandingUpdates(): Promise<LandingUpdate[]> {
  if (process.env.NODE_ENV === 'development' || !db) {
    console.warn('UpdatesSection: Development mode or DB not available, returning mock updates.');
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
