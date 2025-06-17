# Firestore Schema Documentation

This document outlines the structure of the Firestore database for the Darker Patterns Research project.

## Collections

### `dpo_entries`

Stores the main entries for the Dark Patterns project.

- **Document ID:** `entryId` (string)
- **Data:** `DPOEntry` type

### `evaluations`

Stores user evaluations of the DPO entries.

- **Document ID:** Auto-generated
- **Data:** `EvaluationData` type
- **Fields:**
  - `dpoEntryId`: (string) Foreign key to the `dpo_entries` collection.

### `participant_flags`

Stores flags raised by participants for specific entries. This is a root collection.

- **Document ID:** Auto-generated
- **Data:** `ParticipantFlag` type
- **Fields:**
  - `dpoEntryId`: (string) Foreign key to the `dpo_entries` collection.

### `survey_participants`

Stores information about the participants in the survey.

- **Document ID:** `participantSessionUid` (string)
- **Data:** `ParticipantSession` type

### `cached_statistics`

Stores cached statistics for the landing page.

- **Document ID:** `overview_stats`
- **Data:** `LandingStats` type

### `admin_settings`

Stores global settings for the admin dashboard.

- **Document ID:** `global_config`
- **Data:** `AdminSettings` type

### `stats_demographics`

Stores demographics statistics for each entry.

- **Document ID:** `entryId` (string)
- **Data:** `DemographicsSummary` type

### `stats_responses`

Stores response aggregates for each entry.

- **Document ID:** `entryId` (string)
- **Data:** `ResponseAggregates` type

### `users`

Stores user profile information.

- **Document ID:** `firebaseUser.uid` (string)
- **Data:** `UserDataFromFirestore` type
