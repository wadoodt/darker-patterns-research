# Firestore Schema and Security Rules

This document outlines the Firestore database structure and the security rules that govern access to the data for the Darker Patterns Research project.

## User Roles

User access is controlled by roles assigned to their user document in the `users` collection. The roles are:

- **`admin`**: Full access to all data and settings. Can manage users, entries, and configurations.
- **`researcher`**: Can view all project data (entries, evaluations, etc.) and submit revisions to entries for admin approval.
- **`authenticated user`**: Any logged-in user. Can participate in the survey, submit evaluations, and flag entries.
- **`public`**: Any user, including those not logged in.

---

## Collections & Security Rules

### `dpo_entries`

Stores the main dataset entries for the Dark Patterns project.

- **Document ID**: `entryId` (string)
- **Data**: `DPOEntry` type
- **Security Rules**:
  - **`read`**: `admin`, `researcher`
  - **`write`**: `admin`
  - **`update`**: `admin`. Researchers can submit revisions via the `reviseDpoEntry` Cloud Function, which has its own logic to allow limited field updates.
  - **`create`, `delete`**: `admin`

### `dpo_revisions`

Stores proposed revisions to DPO entries submitted by researchers.

- **Document ID**: Auto-generated
- **Data**: `DPORevision` type
- **Security Rules**:
  - **`read`**: `admin`, `researcher`
  - **`create`**: `researcher`
  - **`update`**: `admin` (for status changes)
  - **`delete`**: `admin`

### `evaluations`

Stores evaluations submitted by authenticated users.

- **Document ID**: Auto-generated
- **Data**: `EvaluationData` type (with `agreementRating` instead of `rating`)
- **Security Rules**:
  - **`read`**: `admin`, `researcher`
  - **`create`**: `authenticated user` (can only create for their own session)
  - **`update`, `delete`**: `admin`

### `participant_flags`

Stores flags raised by participants for specific entries.

- **Document ID**: Auto-generated
- **Data**: `ParticipantFlag` type
- **Security Rules**:
  - **`read`**: `admin`, `researcher`
  - **`create`**: `authenticated user` (can only create for their own session)
  - **`update`, `delete`**: `admin`

### `survey_participants`

Stores session and demographic data for survey participants.

- **Document ID**: `participantSessionUid` (string)
- **Data**: `ParticipantSession` type
- **Security Rules**:
  - **`read`**: `admin`, `researcher`, `owner`
  - **`create`, `update`**: `owner`, `admin`
  - **`delete`**: `admin`

### `users`

Stores user profiles and roles.

- **Document ID**: `firebaseUser.uid` (string)
- **Data**: `UserData` (includes a `roles` map, e.g., `{ admin: true }`)
- **Security Rules**:
  - **`read`, `write`**: `owner`, `admin`

### `admin_settings`

Stores global settings for the admin dashboard.

- **Document ID**: `global_config`
- **Data**: `AdminSettings` type
- **Security Rules**:
  - **`read`, `write`**: `admin`

### `landing_updates`

Stores content for the landing page updates section.

- **Document ID**: Auto-generated
- **Data**: `{ title: string, content: string, date: Timestamp }`
- **Security Rules**:
  - **`read`**: `public`
  - **`write`**: `admin`

### `cached_stats`

Stores cached statistics for the landing page and admin dashboard.

- **Document ID**: `overview_stats`, `demographics_summary`, `response_aggregates`
- **Data**: `OverviewStats`, `DemographicsSummary`, `ResponseAggregates` types
- **Security Rules**:
  - **`read`**: `public` (for `overview_stats`), `admin` / `researcher` for others
  - **`write`**: `false` (only backend functions can update)

### `activity_log`

Stores a log of important events that occur in the system for auditing and display in the admin dashboard.

- **Document ID**: Auto-generated
- **Data**: `ActivityLogItem` type
- **Security Rules**:
  - **`read`**: `admin`, `researcher`
  - **`write`**: `false` (only backend functions can write)
