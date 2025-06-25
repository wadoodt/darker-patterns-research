# Firestore Indexing Strategy: A Post-Mortem and Guide

## 1. Executive Summary

This document outlines a robust strategy for managing Firestore composite indexes. It was created following a series of critical failures that resulted in a persistent inability to deploy a correct index configuration, causing application-level query errors. The root causes were a flawed, reactive approach to index creation, a misunderstanding of Firestore's indexing rules, and an incorrect deployment workflow.

The strategy outlined here is designed to be proactive, ensuring that indexes are derived directly from application code and that the deployment process is reliable and predictable.

## 2. Root Cause Analysis of Failures

Our previous attempts failed due to three primary reasons:

### Failure 1: Reactive, Error-Driven Index Creation

Instead of analyzing the application's data-access patterns, we waited for Firestore to throw an error and then attempted to build an index to fix it. This is an inefficient and incomplete strategy because it fails to account for all possible query permutations that the application can generate.

### Failure 2: Misunderstanding of Firestore Indexing Nuances

We made critical errors in the index definitions:

- **`id` vs. `__name__`**: We repeatedly used `id` when defining indexes for sorting by document ID. The correct, internal field path that Firestore requires for this is `__name__`.
- **Query Scope**: We did not consistently match the index scope (`COLLECTION` or `COLLECTION_GROUP`) with the query being performed in the code (e.g., `collection()` vs. `collectionGroup()`).

### Failure 3: Firebase CLI Deployment Pitfalls

The `firebase deploy --only firestore:indexes` command does **not** delete indexes that exist on the server but are absent from the local `firestore.indexes.json` file. This led to a deployment deadlock where old, conflicting indexes on the server blocked the deployment of the new, correct configuration, resulting in repeated `409 Conflict` errors.

## 3. The Definitive Indexing Strategy

To avoid these failures in the future, the following three-step process must be followed.

### Step 1: Analyze the Code First (The Source of Truth)

Before writing or modifying any indexes, the application code is the first place to look.

1.  **Identify Query-Building Logic**: Locate all functions or code sections that build and execute Firestore queries (e.g., `buildDpoEntriesQuery` in `src/lib/firestore/queries/admin.ts`).
2.  **Map All Query Permutations**: Analyze the code to understand every possible combination of `where()` clauses and `orderBy()` clauses that can be generated. Pay close attention to which filters and sort orders can be applied simultaneously.

### Step 2: Define the Minimal Required Indexes

Based on the code analysis, define the minimal set of composite indexes in `firestore.indexes.json`.

- **One Index Per Query**: Each unique query permutation requires its own composite index.
- **Use `__name__`**: When sorting by document ID, always use `__name__` as the `fieldPath`.
- **Match the Scope**: Ensure the `queryScope` (`COLLECTION_GROUP` or `COLLECTION`) matches the query function used in the code.

### Step 3: Use a Reliable Deployment Workflow

The `firestore.indexes.json` file in your repository should be treated as the **single source of truth** for your index configuration. Avoid making manual changes in the Firebase Console, as this leads to state drift.

- **To deploy changes**: Use the `force` flag to ensure the server's state becomes an exact mirror of your local configuration file. This command will delete any indexes on the server that are not in your local file and create any that are missing.

  ```bash
  firebase deploy --only firestore:indexes --force
  ```

This command is the key to breaking deployment deadlocks and ensuring a consistent state.

## 4. Key Takeaways

- **Code-First**: Your application's query logic dictates your indexes, not the other way around.
- **`__name__` is King**: For document ID sorting in indexes, it's always `__name__`.
- **Embrace `--force`**: To resolve state drift between your local file and the server, `deploy --force` is your most reliable tool.
- **No Manual Edits**: Treat the Firebase Console as a read-only view of your indexes. The `firestore.indexes.json` file is where all changes should be made.
