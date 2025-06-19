import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import type { ActivityLogItemFc, ParticipantFlag } from '../types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const logParticipantFlagActivity = onDocumentCreated(
  'dpo_entries/{entryId}/participant_flags/{flagId}',
  async (event) => {
    const snap = event.data;
    const context = { params: event.params };
    const flagData = snap?.data() as ParticipantFlag | undefined;
    if (!flagData) {
      functions.logger.error('No data in new flag snapshot for activity log.', {
        entryId: context.params.entryId,
        flagId: context.params.flagId,
      });
      return null;
    }
    const activityLogRef = db.collection('activity_log').doc();
    const entryIdShort = context.params.entryId.substring(0, 6);
    const participantSessionShortId = flagData.participantSessionUid.substring(0, 6);
    const reasonShort = flagData.reason.substring(0, 30);
    let displayText = `Entry ${entryIdShort}...`;
    displayText += `flagged by PUID ${participantSessionShortId}...`;
    displayText += `Reason: ${reasonShort}...`;
    const iconName = 'Flag';
    try {
      await activityLogRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        eventType: 'participant_flag_submitted',
        participantSessionUid: flagData.participantSessionUid,
        dpoEntryId: context.params.entryId,
        details: {
          reason: flagData.reason,
          commentProvided: !!flagData.comment,
        },
        displayText: displayText,
        iconName: iconName,
        actionLink: `/admin/entries/${context.params.entryId}`,
        actionText: 'Review Flag',
      } as ActivityLogItemFc);
      functions.logger.info('Activity logged: participant_flag_submitted', {
        entryId: context.params.entryId,
        flagId: context.params.flagId,
      });
      return null;
    } catch (error) {
      functions.logger.error('Error logging participant flag activity:', error, {
        entryId: context.params.entryId,
        flagId: context.params.flagId,
      });
      return null;
    }
  },
);
