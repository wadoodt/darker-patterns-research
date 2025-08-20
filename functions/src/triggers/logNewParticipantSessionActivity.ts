import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import type { ActivityLogItemFc, ParticipantSession } from '../types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const logNewParticipantSessionActivity = onDocumentCreated(
  'survey_participants/{participantId}',
  async (event) => {
    const snap = event.data;
    const context = { params: event.params };
    const participantData = snap?.data() as ParticipantSession | undefined;
    if (!participantData) {
      functions.logger.error('No data in new participant snapshot for activity log.', {
        participantId: context.params.participantId,
      });
      return null;
    }
    const activityLogRef = db.collection('activity_log').doc();
    const displayText = `New participant session started: ${context.params.participantId.substring(0, 6)}...`;
    const iconName = 'User';
    try {
      await activityLogRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        eventType: 'participant_session_started',
        participantSessionUid: context.params.participantId,
        details: {
          participationType: participantData.email ? 'email' : 'anonymous',
          emailProvided: !!participantData.email,
        },
        displayText: displayText,
        iconName: iconName,
      } as ActivityLogItemFc);
      functions.logger.info('Activity logged: participant_session_started', {
        participantId: context.params.participantId,
      });
      return null;
    } catch (error) {
      functions.logger.error('Error logging new participant session:', error, {
        participantId: context.params.participantId,
      });
      return null;
    }
  },
);
