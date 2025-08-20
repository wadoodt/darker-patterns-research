/**
 * @fileoverview This file serves as the main entry point for all Firebase Functions.
 * It consolidates and exports all trigger and callable functions from their modularized files.
 *
 * @description
 * The functions are organized into two main categories:
 * - `triggers`: Background functions that respond to events in Firebase services (e.g., Firestore, Auth).
 * - `api`: Callable HTTPS functions that can be invoked directly from client applications.
 *
 * By maintaining this central index, deployment and management of functions are simplified,
 * while the logic for each function is kept isolated in its own file for clarity and maintainability.
 */

// =================================================================================================
// Triggers
// =================================================================================================

// Responds to new evaluations to update aggregate statistics for a DPO entry.
export { onNewEvaluationUpdateStats } from './triggers/onNewEvaluationUpdateStats';

// Updates participant demographics when a new participant document is created.
export { onNewParticipantUpdateDemographics } from './triggers/onNewParticipantUpdateDemographics';

// Updates a participant's email in other collections when their auth email changes.
export { onParticipantEmailUpdate } from './triggers/onParticipantEmailUpdate';

// Logs a new activity item whenever an evaluation is created.
export { logNewEvaluationActivity } from './triggers/logNewEvaluationActivity';

// Logs a new activity item whenever a participant session is created.
export { logNewParticipantSessionActivity } from './triggers/logNewParticipantSessionActivity';

// Logs a new activity item whenever a participant flag is created.
export { logParticipantFlagActivity } from './triggers/logParticipantFlagActivity';

// =================================================================================================
// API (Callable Functions)
// =================================================================================================

// Deletes a DPO entry and its associated data.
export { deleteDpoEntry } from './api/deleteDpoEntry';

// Exports participant or evaluation data in JSON or CSV format.
export { exportData } from './api/exportData';

// Retrieves detailed information for a single DPO entry.
export { getEntryDetails } from './api/getEntryDetails';

// Ingests a dataset of DPO entries into Firestore.
export { ingestDpoDataset } from './api/ingestDpoDataset';

// Increments the view count for a DPO entry.
export { incrementEntryViewCount } from './api/incrementEntryViewCount';

// Revises an existing DPO entry by archiving the old one and creating a new one.
export { reviseDpoEntry } from './api/reviseDpoEntry';

// Exports an augmented dataset of DPO entries.
export { exportDpoDataset } from './api/exportDpoDataset';
