import { collection, getCountFromServer, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  ParticipantSession,
  DashboardData,
  EvaluationData,
  ParticipantFlag,
  RecentActivityItem,
} from '@/types/dpo';

/**
 * Fetches the main statistics for the dashboard's stat cards.
 * @returns A promise that resolves to an object containing the overview stats.
 */
export async function getOverviewStats(): Promise<Partial<DashboardData>> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  try {
    const dpoEntriesCollection = collection(db, 'dpo_entries');
    const evaluationsCollection = collection(db, 'evaluations');

    const totalEntriesSnapshot = await getCountFromServer(dpoEntriesCollection);
    const completedEntriesSnapshot = await getCountFromServer(evaluationsCollection);

    const totalEntries = totalEntriesSnapshot.data().count;
    const entriesCompleted = completedEntriesSnapshot.data().count;

    // Calculate average time per entry
    const evaluationsQuery = query(evaluationsCollection);
    const evaluationsSnapshot = await getDocs(evaluationsQuery);
    const totalTimeSpent = evaluationsSnapshot.docs.reduce((acc, doc) => acc + (doc.data().timeSpentMs || 0), 0);
    const avgTimePerEntry = entriesCompleted > 0 ? totalTimeSpent / entriesCompleted : 0;

    const uniqueParticipants = new Set(evaluationsSnapshot.docs.map((doc) => doc.data().participantSessionUid));
    const activeParticipants = uniqueParticipants.size;

    return {
      totalEntries,
      entriesCompleted,
      avgTimePerEntry: (avgTimePerEntry / 1000).toFixed(2), // in seconds
      activeParticipants,
    };
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    throw new Error('Failed to fetch overview stats.');
  }
}

/**
 * Fetches and processes demographics data for the dashboard charts.
 * @returns A promise that resolves to an object containing aggregated demographics data.
 */
export async function getDemographicsData(): Promise<Partial<DashboardData>> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  try {
    const participantsCollection = collection(db, 'survey_participants');
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

    const totalParticipants = participants.length;

    const ageDemographics = Object.entries(ageDistribution).map(([range, count]) => ({
      range,
      percent: totalParticipants > 0 ? (count / totalParticipants) * 100 : 0,
    }));

    const techBackgroundDemographics = Object.entries(techBackgroundDistribution).map(([label, count]) => ({
      label,
      percent: totalParticipants > 0 ? (count / totalParticipants) * 100 : 0,
    }));

    return {
      demographics: {
        age: ageDemographics,
        technicalBackground: techBackgroundDemographics,
      },
    };
  } catch (error) {
    console.error('Error fetching demographics data:', error);
    throw new Error('Failed to fetch demographics data.');
  }
}

/**
 * Fetches the most recent activities (evaluations, flags, new participants).
 * @returns A promise that resolves to an object containing a list of recent activities.
 */
export async function getRecentActivity(): Promise<Partial<DashboardData>> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  try {
    // Fetch recent evaluations
    const evaluationsQuery = query(collection(db, 'evaluations'), orderBy('submittedAt', 'desc'), limit(5));
    const evaluationsSnapshot = await getDocs(evaluationsQuery);
    const evaluationActivities: RecentActivityItem[] = evaluationsSnapshot.docs.map((doc) => {
      const data = doc.data() as EvaluationData;
      return {
        id: doc.id,
        type: 'evaluation',
        description: `Evaluation submitted for entry ${data.dpoEntryId}.`,
        timestamp: (data.submittedAt as Timestamp).toDate(),
      };
    });

    // Fetch recent flags
    const flagsQuery = query(collection(db, 'participant_flags'), orderBy('flaggedAt', 'desc'), limit(5));
    const flagsSnapshot = await getDocs(flagsQuery);
    const flagActivities: RecentActivityItem[] = flagsSnapshot.docs.map((doc) => {
      const data = doc.data() as ParticipantFlag;
      return {
        id: doc.id,
        type: 'flag',
        description: `Entry flagged for reason: ${data.reason}`,
        timestamp: (data.flaggedAt as Timestamp).toDate(),
      };
    });

    // Fetch new participants
    const participantsQuery = query(collection(db, 'survey_participants'), orderBy('createdAt', 'desc'), limit(5));
    const participantsSnapshot = await getDocs(participantsQuery);
    const participantActivities: RecentActivityItem[] = participantsSnapshot.docs.map((doc) => {
      const data = doc.data() as ParticipantSession;
      return {
        id: doc.id,
        type: 'new_participant',
        description: `New participant joined (${data.participationType}).`,
        timestamp: (data.createdAt as Timestamp).toDate(),
      };
    });

    // Combine, sort, and limit activities
    const recentActivity = [...evaluationActivities, ...flagActivities, ...participantActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return { recentActivity };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw new Error('Failed to fetch recent activity.');
  }
}

/**
 * Fetches data for the project progress chart (evaluations over time).
 * @returns A promise that resolves to an object containing project progress data.
 */
export async function getProjectProgressData(): Promise<Partial<DashboardData>> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  try {
    const evaluationsQuery = query(collection(db, 'evaluations'), orderBy('submittedAt', 'asc'));
    const evaluationsSnapshot = await getDocs(evaluationsQuery);
    const evaluations = evaluationsSnapshot.docs.map((doc) => doc.data() as EvaluationData);

    const progressData = evaluations.reduce(
      (acc, evaluation) => {
        const date = (evaluation.submittedAt as Timestamp).toDate().toISOString().split('T')[0]; // YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const projectProgress = Object.entries(progressData).map(([date, count]) => ({
      date,
      count,
    }));

    return { projectProgress };
  } catch (error) {
    console.error('Error fetching project progress data:', error);
    throw new Error('Failed to fetch project progress data.');
  }
}
