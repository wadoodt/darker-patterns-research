import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import type { DemographicData, ParticipantSession } from '../types';

interface DemographicsSummaryData {
  totalParticipantsWithDemographics?: number;
  ageGroupDistribution?: Record<string, number>;
  genderDistribution?: Record<string, number>;
  educationDistribution?: Record<string, number>;
  expertiseDistribution?: Record<string, number>;
  aiFamiliarityDistribution?: Record<string, number>;
}

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

const updateIncrement = (obj: Record<string, number> | undefined, key: string): Record<string, number> => {
  const currentObj = obj || {};
  return {
    ...currentObj,
    [key]: (currentObj[key] || 0) + 1,
  };
};

export const onNewParticipantUpdateDemographics = onDocumentCreated(
  'survey_participants/{participantId}',
  async (event) => {
    const snap = event.data;
    const context = { params: event.params };
    const participantData = snap?.data() as ParticipantSession | undefined;
    const demographics = participantData?.demographics as DemographicData | undefined;

    if (!demographics || Object.keys(demographics).length === 0) {
      functions.logger.info('No demographics data to update for participant.', {
        participantId: context.params.participantId,
      });
      return null;
    }
    const summaryRef = db.doc('cached_statistics/demographics_summary');

    try {
      return await db.runTransaction(async (transaction) => {
        const summaryDoc = await transaction.get(summaryRef);
        const currentSummary = (summaryDoc.data() as DemographicsSummaryData) || {};

        const newSummaryData: Partial<DemographicsSummaryData> & { lastUpdatedAt: admin.firestore.FieldValue } = {
          totalParticipantsWithDemographics: (currentSummary.totalParticipantsWithDemographics || 0) + 1,
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (demographics.ageGroup) {
          newSummaryData.ageGroupDistribution = updateIncrement(
            currentSummary.ageGroupDistribution,
            demographics.ageGroup,
          );
        }
        if (demographics.gender) {
          newSummaryData.genderDistribution = updateIncrement(currentSummary.genderDistribution, demographics.gender);
        }
        if (demographics.educationLevel) {
          newSummaryData.educationDistribution = updateIncrement(
            currentSummary.educationDistribution,
            demographics.educationLevel,
          );
        }
        if (demographics.fieldOfExpertise) {
          newSummaryData.expertiseDistribution = updateIncrement(
            currentSummary.expertiseDistribution,
            demographics.fieldOfExpertise,
          );
        }
        if (demographics.aiFamiliarity) {
          newSummaryData.aiFamiliarityDistribution = updateIncrement(
            currentSummary.aiFamiliarityDistribution,
            demographics.aiFamiliarity,
          );
        }

        transaction.set(summaryRef, newSummaryData, { merge: true });
        return null;
      });
    } catch (error) {
      functions.logger.error('Transaction failure onNewParticipantUpdateDemographics:', error, {
        participantId: context.params.participantId,
      });
      return null;
    }
  },
);
