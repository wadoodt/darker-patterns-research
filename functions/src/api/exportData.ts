import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import * as functions from 'firebase-functions/v2';
import type { CallableRequest } from 'firebase-functions/v2/https';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { ParticipantSession } from '../types';

interface AuthTokenWithAdmin extends DecodedIdToken {
  admin?: boolean;
}

interface ExportDataRequest {
  dataType: 'participantEmailsCSV' | 'allResponsesJSON';
}

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const exportData = onCall({ region: 'us-central1' }, async (req: CallableRequest<ExportDataRequest>) => {
  if (!req.auth || !(req.auth.token as AuthTokenWithAdmin).admin) {
    functions.logger.warn('Unauthorized export attempt by UID:', req.auth?.uid);
    throw new HttpsError('permission-denied', 'User must be an admin to export data.');
  }
  const dataType = req.data.dataType;
  const bucket = getStorage().bucket(); // Default storage bucket
  const timestamp = Date.now();
  let fileContent = '';
  let fileName = '';
  let contentType = '';
  try {
    if (dataType === 'participantEmailsCSV') {
      fileName = `participant_emails_opted_in_${timestamp}.csv`;
      contentType = 'text/csv;charset=utf-8;';
      const participantsSnap = await db
        .collection('survey_participants')
        .where('email', '!=', null)
        .where('optedInForPaper', '==', true)
        .get();
      const csvHeader = '"Participant UID","Email","Consent for Paper","Expertise","AI Familiarity"';
      const csvRows = participantsSnap.docs
        .map((doc) => {
          const data = doc.data() as ParticipantSession;
          const demo = data.demographics || {};
          return (
            `"${doc.id}","${data.email}","${data.optedInForPaper ? 'Yes' : 'No'}",` +
            `"${demo.fieldOfExpertise || ''}","${demo.aiFamiliarity || ''}"`
          );
        })
        .join('\n');
      fileContent = csvHeader + '\n' + csvRows;
    } else if (dataType === 'allResponsesJSON') {
      fileName = `all_evaluations_${timestamp}.json`;
      contentType = 'application/json;charset=utf-8;';
      const evaluationsSnap = await db.collection('evaluations').get();
      const evaluations = evaluationsSnap.docs.map((doc) => doc.data());
      fileContent = JSON.stringify(evaluations, null, 2);
    } else {
      throw new HttpsError('invalid-argument', 'The dataType parameter is invalid.');
    }

    const file = bucket.file(`exports/${fileName}`);
    await file.save(fileContent, { contentType });
    const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 15 });

    functions.logger.info(`Export generated: ${fileName}, URL: ${url.substring(0, 50)}...`, {
      uid: req.auth.uid,
      dataType,
    });
    return { downloadUrl: url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate export file.';
    functions.logger.error(`Error during export for dataType ${dataType}:`, error, { uid: req.auth?.uid });
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', message);
  }
});
