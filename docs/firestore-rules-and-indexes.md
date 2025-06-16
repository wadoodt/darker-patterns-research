# Firestore Rules & Indexes for Survey App

This document describes how to implement the required `firebase.rules` and `firestore.indexes.json` for the survey application, based on the current logic in `src/lib/survey/database.ts`. This will be updated as new features (survey, landing page, contact form, admin) are added.

---

## 1. Firestore Collections Used

- `dpo_entries`: Stores DPO entry data (used for survey questions).
- `survey_participants`: Stores participant session and demographic data.
- `evaluations`: Stores individual survey responses/evaluations.
- `cached_statistics`: Stores landing/overview stats for fast access on the landing page.
- `admin_settings`: Stores admin configuration, including landing page updates (`global_config` doc).

---

## 2. Required Firestore Indexes

### a. For Survey Entry Fetching

The function fetches entries ordered by `reviewCount` (ascending) and limited by a count. This requires a single-field index:

```json
{
  "collectionId": "dpo_entries",
  "fields": [{ "fieldPath": "reviewCount", "order": "ASCENDING" }]
}
```

**Add to `firestore.indexes.json`:**

```json
{
  "indexes": [
    {
      "collectionGroup": "dpo_entries",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "reviewCount", "order": "ASCENDING" }]
    }
  ],
  "fieldOverrides": []
}
```

> **Note:**
>
> - If you add more complex queries (e.g., filtering by category, or combining orderBy with where), you may need composite indexes.
> - If you query `evaluations` or `admin_settings` with filters/order, add indexes as needed.

---

## 3. Firestore Security Rules

### a. General Principles

- Only authenticated users can submit survey data.
- Only admin users can read/write all data.
- Survey participants can only write their own session and evaluations.
- No public write access to `dpo_entries` (admin only).
- Only admin can write to `cached_statistics` and `admin_settings`.
- Landing page and progress data (e.g., `cached_statistics`, `admin_settings/global_config`) should be readable by all, but only writable by admin.

### b. Example `firebase.rules`

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DPO Entries: Read for all, write for admin only
    match /dpo_entries/{entryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Survey Participants: Only the participant or admin can write/read
    match /survey_participants/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || request.auth.token.admin == true);
    }

    // Evaluations: Only the participant or admin can write/read
    match /evaluations/{evalId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
      allow create: if request.auth != null;
    }

    // Cached statistics for landing/progress: Read for all, write for admin only
    match /cached_statistics/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Admin settings (landing updates, config): Read for all, write for admin only
    match /admin_settings/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

> **Adjustments:**
>
> - If you want to allow anonymous survey participation, relax the `request.auth` checks accordingly.
> - For contact forms or landing page data, add new collections and rules as needed.
> - If you add newsletter signups or contact messages, restrict writes to all, reads to admin only.

---

## 4. Updating for New Features

- **Survey:** Add rules for new collections (e.g., feedback, progress).
- **Landing Page:** If storing submissions (e.g., newsletter), add a collection and restrict writes.
- **Contact Form:** Add a `contact_messages` collection, allow create for all, restrict read to admin.
- **Admin:** Ensure only admin users (e.g., `request.auth.token.admin == true`) can access admin data.
- **Landing Updates:** The `admin_settings/global_config` document holds landing page updates. Only admin can write, all can read.
- **Progress/Stats:** The `cached_statistics/overview_stats` document is used for fast landing page stats. Only admin can write, all can read.

---

## 5. References

- [Firestore Security Rules Docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes Docs](https://firebase.google.com/docs/firestore/query-data/indexing)

---

**Update this document as new collections or access patterns are added.**
