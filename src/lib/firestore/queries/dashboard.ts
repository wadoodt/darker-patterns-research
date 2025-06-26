import { db } from '@/lib/firebase';
import type {
  ChartableDemographics,
  DashboardData,
  EvaluationData,
  ParticipantFlag,
  ParticipantSession,
  ProjectProgressDataPoint,
  RecentActivityItem,
} from '@/types/dpo';
import { collection, doc, Firestore, getDoc, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';

// Helper function to format milliseconds into a readable string 'Xm Ys'
function formatMilliseconds(ms: number): string {
  if (ms < 0) {
    return '0m 0s';
  }
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

// Helper function to get overview stats
async function getOverviewStats(firestore: Firestore) {
  const statsDocRef = doc(firestore, 'cached_statistics', 'overview_stats');
  const statsDocSnap = await getDoc(statsDocRef);

  if (!statsDocSnap.exists()) {
    console.warn('Could not find cached overview stats. Returning default values.');
    return {
      totalEntries: 0,
      entriesCompleted: 0,
      activeParticipants: 0,
      avgTimePerEntry: '0m 0s',
    };
  }

  const statsData = statsDocSnap.data();

  return {
    totalEntries: statsData.totalDPOEntries || 0,
    entriesCompleted: statsData.fullyReviewedEntriesCount || 0,
    activeParticipants: statsData.totalEvaluationsSubmitted || 0,
    avgTimePerEntry: formatMilliseconds(statsData.averageTimePerEvaluationMs || 0),
  };
}

// Helper function to get demographics
async function getDemographicsData(firestore: Firestore): Promise<ChartableDemographics> {
  const participantsCollection = collection(firestore, 'survey_participants');
  const participantsSnapshot = await getDocs(participantsCollection);
  const participants = participantsSnapshot.docs.map((doc) => doc.data() as ParticipantSession);

  const ageDistribution = participants.reduce(
    (acc, p) => {
      const ageGroup = p.demographics?.ageGroup || 'Unknown';
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const techBackgroundDistribution = participants.reduce(
    (acc, p) => {
      const background = p.demographics?.fieldOfExpertise || 'Unknown';
      acc[background] = (acc[background] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    age: Object.entries(ageDistribution).map(([name, value]) => ({ name, value })),
    technicalBackground: Object.entries(techBackgroundDistribution).map(([name, value]) => ({ name, value })),
  };
}

// Helper function to get recent activity
async function getRecentActivity(firestore: Firestore): Promise<RecentActivityItem[]> {
  const evaluationsCollection = collection(firestore, 'evaluations');
  const flagsCollection = collection(firestore, 'participant_flags');

  const evaluationsQuery = query(evaluationsCollection, orderBy('submittedAt', 'desc'), limit(5));
  const flagsQuery = query(flagsCollection, orderBy('flaggedAt', 'desc'), limit(5));

  const [evaluationsSnapshot, flagsSnapshot] = await Promise.all([getDocs(evaluationsQuery), getDocs(flagsQuery)]);

  const evaluationActivities: RecentActivityItem[] = evaluationsSnapshot.docs.map((doc) => {
    const data = doc.data() as EvaluationData;
    return {
      id: doc.id,
      type: 'evaluation',
      description: `Evaluation for entry ${data.dpoEntryId} completed.`,
      timestamp: (data.submittedAt as Timestamp).toDate(),
      href: `/admin/entries/${data.dpoEntryId}`,
    };
  });

  const flagActivities: RecentActivityItem[] = flagsSnapshot.docs.map((doc) => {
    const data = doc.data() as ParticipantFlag;
    return {
      id: doc.id,
      type: 'flag',
      description: `A participant was flagged. Reason: ${data.reason}`,
      timestamp: (data.flaggedAt as Timestamp).toDate(),
    };
  });

  const combined = [...evaluationActivities, ...flagActivities].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
  return combined.slice(0, 5);
}

// Helper function to get project progress
async function getProjectProgressData(firestore: Firestore): Promise<ProjectProgressDataPoint[]> {
  const evaluationsCollection = collection(firestore, 'evaluations');
  const evaluationsSnapshot = await getDocs(query(evaluationsCollection, orderBy('submittedAt', 'asc')));

  const progressData = evaluationsSnapshot.docs.reduce(
    (acc, doc) => {
      const data = doc.data() as EvaluationData;
      const date = (data.submittedAt as Timestamp).toDate().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(progressData).reduce((acc, [date, count]) => {
    const lastTotal = acc.length > 0 ? acc[acc.length - 1].count : 0;
    acc.push({ date, count: lastTotal + count });
    return acc;
  }, [] as ProjectProgressDataPoint[]);
}

/**
 * Fetches all necessary data for the admin dashboard in a single, consolidated operation.
 */
export async function getDashboardData(): Promise<DashboardData> {
  if (!db) {
    console.error('Firestore is not initialized.');
    // Return a default or empty state for the dashboard to prevent a crash
    return {
      totalEntries: 0,
      entriesCompleted: 0,
      avgTimePerEntry: 'N/A',
      activeParticipants: 0,
      demographics: { age: [], technicalBackground: [] },
      recentActivity: [],
      projectProgress: [],
    };
  }

  try {
    const [overviewStats, demographics, recentActivity, projectProgress] = await Promise.all([
      getOverviewStats(db),
      getDemographicsData(db),
      getRecentActivity(db),
      getProjectProgressData(db),
    ]);

    return {
      ...overviewStats,
      demographics,
      recentActivity,
      projectProgress,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return a default or empty state for the dashboard to prevent a crash
    return {
      totalEntries: 0,
      entriesCompleted: 0,
      avgTimePerEntry: 'N/A',
      activeParticipants: 0,
      demographics: { age: [], technicalBackground: [] },
      recentActivity: [],
      projectProgress: [],
    };
  }
}
