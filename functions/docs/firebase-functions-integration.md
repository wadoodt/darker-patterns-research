# Firebase Functions: Integration and Best Practices Guide (v2 Update)

Firebase Functions allow you to run backend code in response to events triggered by Firebase features and HTTPS requests. This guide details how to set up, write, and deploy Firebase Functions for your project, focusing on Firestore triggers for data aggregation and activity logging, updated for v2 syntax and best practices.

## 1. Initial Setup

**Prerequisites:**

- Firebase CLI installed and configured (see `firebase-cli-setup-deploy.md`). Ensure you have a recent version of the CLI.
- Your local project initialized for Firebase (`firebase init`).
- **Node.js 18 or higher is required.**

**Initializing Functions in Your Project:**

If you haven't already initialized Functions during `firebase init`:

1.  Navigate to your project's root directory.
2.  Run:

    ```bash
    firebase init functions
    ```

3.  **Language:** Choose **TypeScript**. (JavaScript is also an option, but TypeScript is strongly recommended).
4.  **ESLint:** Choose **Yes** to use ESLint for code linting.
5.  **Install Dependencies:** Choose **Yes** to install dependencies with npm.

This creates a `functions` folder in your project root with the following structure:

```
functions/
├── src/          # Your TypeScript source code (e.g., index.ts)
├── package.json  # Node.js dependencies for your functions
├── tsconfig.json # TypeScript configuration
├── .eslintrc.js  # ESLint configuration
└── lib/          # Compiled JavaScript (generated during deployment or build)
```

**Install Core Dependencies:**

Navigate into the `functions` directory and install essential packages:

```bash
cd functions
npm install firebase-admin firebase-functions
cd ..
```

- `firebase-admin`: The Admin SDK allows your functions to interact with Firebase services with administrative privileges (bypassing security rules).
- `firebase-functions`: Provides the SDK for defining Cloud Functions triggers and runtime settings.

## 2. Writing Your First Function (Firestore Trigger - v2 Syntax)

Your main functions code will typically reside in `functions/src/index.ts`. **It's crucial to use the v2 syntax for new functions.**

**Initializing the Admin SDK:**

At the top of your `functions/src/index.ts`:

```typescript
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';

initializeApp(); // Initialize the Admin SDK
const db = getFirestore(); // Get a Firestore instance

setGlobalOptions({ region: 'us-central1' }); // Set default region for all functions
```

- **`initializeApp` and `getFirestore`:** Imported from `firebase-admin/app` and `firebase-admin/firestore` respectively.
- **`onDocumentCreated`:** Imported from `firebase-functions/v2/firestore`. This is the v2 trigger syntax.
- **`setGlobalOptions`:** Sets global options like region. This is a v2 feature. It's good practice to set the region explicitly.

**Example: Firestore `onCreate` Trigger (v2)**

This function triggers when a new document is created in the `evaluations` collection.

```typescript
// functions/src/index.ts

// ... (imports and admin.initializeApp() as above)

export const onNewEvaluationSubmitted = onDocumentCreated('evaluations/{evaluationId}', async (event) => {
  const evaluationId = event.params.evaluationId; // Get the ID of the new document
  const newData = event.data.data(); // Access document data using .data()
  if (!newData) {
    console.error(`No data associated with evaluationId: ${evaluationId}`);
    return; // void return for v2
  }

  console.log(`New evaluation ${evaluationId} created:`, newData);

  // Example: Log an activity
  const activityLogRef = db.collection('activity_log').doc();
  try {
    await activityLogRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      eventType: 'new_evaluation',
      message: `Evaluation ${evaluationId} submitted by ${newData.participantSessionUid?.substring(0, 6)}...`, // Optional chaining
      details: {
        dpoEntryId: newData.dpoEntryId,
        rating: newData.rating,
      },
      iconName: 'CheckSquare',
    });
    console.log(`Activity logged for evaluation ${evaluationId}`);
  } catch (error) {
    console.error(`Error logging activity for ${evaluationId}:`, error);
  }

  // Example: Update an aggregate counter in a transaction
  const overviewStatsRef = db.doc('cached_statistics/overview_stats');
  try {
    await db.runTransaction(async (transaction) => {
      const overviewStatsDoc = await transaction.get(overviewStatsRef);
      const currentTotal = overviewStatsDoc.data()?.totalEvaluationsSubmitted || 0;
      transaction.set(
        overviewStatsRef,
        {
          totalEvaluationsSubmitted: currentTotal + 1,
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });
    console.log(`Updated totalEvaluationsSubmitted for ${evaluationId}`);
  } catch (error) {
    console.error(`Error updating overview_stats for ${evaluationId}:`, error);
  }
});
```

**Key Changes in v2:**

- **Event Data Access:** Use `event.data.data()` to access the document data. `event.data` is now a `DocumentSnapshot`.
- **Return Type:** v2 functions should return `void` or `Promise<void>`. Don't return `null`.
- **Error Handling:** Rethrow errors or use `console.error` for logging.
- **Context:** The `context` object is now part of the `event` object (e.g., `event.params`).
- **Imports:** Use the `firebase-functions/v2` imports for triggers.

**Other Firestore Triggers (v2):**

- `onDocumentUpdated("evaluations/{evaluationId}", async (event) => { ... })`: Triggers on document updates. Access old and new data using `event.data.before.data()` and `event.data.after.data()`.
- `onDocumentDeleted("evaluations/{evaluationId}", async (event) => { ... })`: Triggers on document deletion.
- `onDocumentWritten("evaluations/{evaluationId}", async (event) => { ... })`: Triggers on create, update, or delete.

## 3. Common Use Cases for This Project

### a. Aggregating Statistics (`cached_statistics`)

- **Trigger:** On new `evaluations` created, or `survey_participants` created/updated.
- **Action:**

  - Read the current aggregate document (e.g., `cached_statistics/overview_stats` or `cached_statistics/demographics_summary`).
  - Update counts, averages, or distributions based on the new data.
  - Write the updated aggregate back to Firestore.
  - **Always use Firestore transactions** for read-modify-write operations on aggregate counters to prevent race conditions.

  ```typescript
  // Inside a function, e.g., updating a counter
  import { getFirestore, FieldValue } from 'firebase-admin/firestore';
  const db = getFirestore();
  const statRef = db.doc('cached_statistics/my_counter_doc');
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(statRef);
    const newCount = (doc.data()?.count || 0) + 1;
    transaction.update(statRef, {
      count: newCount,
      lastUpdatedAt: FieldValue.serverTimestamp(),
    });
  });
  ```

### b. Populating an Activity Log (`activity_log`)

- **Trigger:** On various Firestore events (new evaluation, new participant, entry flagged, admin action, etc.).
- **Action:**
  - Construct an `ActivityLogItem` object containing relevant details (timestamp, event type, user ID, affected document ID, display message, icon name).
  - Write this object as a new document to the `activity_log` collection.

## 4. Structuring Your Functions Code

For larger projects, keeping all functions in `index.ts` can become unmanageable. You can organize them into separate files:

```
functions/
\u2514\u2500\u2500 src/
    \u251c\u2500\u2500 index.ts            # Main file, exports all functions
    \u251c\u2500\u2500 aggregators.ts      # Functions for updating cached_statistics
    \u2514\u2500\u2500 activityLogger.ts   # Functions for populating activity_log
    \u2514\u2500\u2500 ...                 # Other modules
```

**`functions/src/index.ts`:**

```typescript
import * as functions from 'firebase-functions/v2';
import { setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
setGlobalOptions({ region: 'us-central1' });

// Import and re-export functions from other files
export * from './aggregators';
export * from './activityLogger';
// export * from "./otherModule";

// Example: A simple HTTPS callable function defined directly
export const helloWorld = functions.https.onCall((request) => {
  return { message: 'Hello from Firebase!', dataReceived: request.data };
});
```

**`functions/src/aggregators.ts`:**

```typescript
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

const db = getFirestore(); // db instance if needed

export const updateOverviewStatsOnNewEval = onDocumentCreated('evaluations/{evaluationId}', async (event) => {
  // ... your logic ...
});

// ... other aggregation functions ...
```

## 5. Local Emulation and Testing

The Firebase Emulator Suite allows you to test your functions (and other Firebase services like Firestore, Auth, Hosting) locally before deploying.

**Setup Emulators:**

1.  Run `firebase init emulators` and select Functions, Firestore, and Hosting.
2.  Configure ports if needed (defaults are usually fine).

**Start Emulators:**

```bash
firebase emulators:start
```

This will start local emulators. Your application, when configured to use the emulators, will interact with these local instances. You can see function logs in the Emulator UI (usually at `http://localhost:4000`).

**Running Functions Tests:**

You can write unit and integration tests for your functions using libraries like Mocha, Chai, and Sinon, along with `firebase-functions-test`. Consider using the `firebase emulators:exec` command to run tests against the emulator suite.

## 6. Deployment

Deploy your functions using the Firebase CLI:

```bash
firebase deploy --only functions
```

To deploy a specific function or group of functions:

```bash
firebase deploy --only functions:myFunctionName,functions:anotherFunctionGroup
```

## 7. Monitoring and Logging

Once deployed, you can monitor your functions and view logs in the Firebase console:

- Go to your Firebase project -> Functions.
- Select a function to view its details, logs, health, and usage metrics.
- Logs are also available in Google Cloud Console under Cloud Functions. **Note that v2 function logs are now integrated with Cloud Run logs.**

## Best Practices

- **Region Selection:** Specify a region for your functions to reduce latency. Use `setGlobalOptions({ region: "us-central1" });` or configure the region per function.
- **Idempotency:** Design functions to produce the same result if they run multiple times for the same event (important for retries). Firestore transactions help.
- **Error Handling:** Implement robust error handling (`try/catch`) and log errors effectively.
- **Minimize Cold Starts:** V2 functions generally have better cold start performance than v1. Consider using minimum instances for critical functions.
- **Environment Configuration:** Use environment variables for configuration. Set these using `firebase functions:config:set someservice.key="THE API KEY"` and access them using `process.env`.
- **Permissions:** Admin SDK bypasses rules. Ensure this is intended. For HTTPS functions callable by clients, validate authentication.
- **Testing:** Write unit and integration tests for your functions.
- **Keep Functions Small and Focused:** Each function should ideally do one thing well.
- **Use the Correct Trigger Type:** Choose the most appropriate trigger for your use case (e.g., `onDocumentCreated` vs. `onDocumentWritten`).
- **Consider Concurrency:** V2 functions allow you to configure concurrency settings. Adjust these based on your function's workload.
- **Use Structured Logging:** Use structured logging (e.g., JSON format) to make it easier to analyze logs.

This guide provides a solid foundation for integrating Firebase Functions into your project. Refer to the [official Firebase Functions documentation](https://firebase.google.com/docs/functions) for more in-depth information. **Pay close attention to the v2 migration guide if you are upgrading from v1 functions.**
