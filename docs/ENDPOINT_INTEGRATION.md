# Endpoint Integration & Data Synchronization Guide

This document outlines the process for adding new API endpoints or updating existing ones. Its purpose is to ensure the frontend remains perfectly synchronized with the backend API contract, leveraging TypeScript and our mock environment to catch breaking changes early.

For a detailed explanation of the mock API's internal workings, see the **[Mock API Architecture](./mock-api-architecture.md)** guide.

## The Golden Rule

**The frontend's types and mock data MUST always be an exact mirror of the backend API contract.**

When the backend changes a data model, the frontend must reflect that change in its own types and mocks *before* the new backend code is deployed. This prevents integration bugs and ensures a smooth development workflow.

---

## Workflow for Handling Backend API Changes

This process begins when a backend engineer modifies an existing API response (e.g., adds a field, removes a field, or changes a type).

### Scenario Example:

The backend is adding a `stripeClientId` to the `User` object.

```diff
// Backend User DTO Change
{
  "id": 1,
  "username": "testuser",
  "role": "admin",
+ "stripeClientId": "cus_123456789"
}
```

### Step 1: Backend Developer's Responsibility

The backend developer's task is to communicate this change clearly. In their Pull Request, they should provide the updated data structure or type definition.

> **Backend PR Description Example:**
> 
> "Updated the `/auth/me` and `/auth/login` endpoints. The `User` object in the response now includes a `stripeClientId: string` field. Frontend must update its types and mocks."

### Step 2: Frontend Developer Updates Local Types

The frontend developer takes the new type definition and updates the corresponding type in the codebase.

```typescript
// src/types/api/index.ts (or a more specific file)

export type User = {
  id: number;
  username: string;
  role: string;
  stripeClientId: string; // Add the new field
};
```

### Step 3: Follow the TypeScript Errors

This is the most powerful step. As soon as the type is updated, TypeScript will generate errors in every part of the application that is now out of sync. This includes:

-   **Mock Data**: The mock user objects in `src/api/mocks/db.ts` will now be missing the `stripeClientId` property.
-   **UI Components**: Any component that receives a `User` object might need adjustments.
-   **Helper Functions**: Any function that processes a `User` object might break.

These errors are not a problem; they are your **to-do list**. Systematically fix each one.

### Step 4: Update the Mock Database and Handlers

This is a **critical, non-negotiable** step. The mock environment must reflect the new reality.

1.  **Update Mock Data (`db.ts`)**: Go to `src/api/mocks/db.ts` and add the new field to all mock user records.

    ```typescript
    // src/api/mocks/db.ts
    db.users.create({
      id: 1,
      username: 'testuser',
      // ...
      stripeClientId: 'cus_mock_123',
    });
    ```

2.  **Verify Mock Handlers**: Ensure the mock handlers in `src/api/mocks/handlers/` are correctly returning the new data structure. Usually, if the mock DB is updated, the handlers will work correctly, but it's always good to check.

### Step 5: Update UI and Logic

With the types and mocks updated, you can now confidently update the UI components and application logic to utilize the new `stripeClientId` field, knowing that your development environment is an accurate reflection of the upcoming backend changes.

---

## Adding a Completely New Endpoint

The process is the same, but you will be creating new files instead of modifying existing ones:

1.  Get the new endpoint's contract (path, method, request body, response shape) from the backend developer.
2.  Add any new, reusable types to `src/types/api/`.
3.  Create new mock data in `src/api/mocks/db.ts` if needed.
4.  Create a new mock handler file in `src/api/mocks/handlers/` for the new endpoint.
5.  Implement the frontend API call and UI logic, following the patterns in the **[API Response & Error Handling Guide](./ERROR_HANDLING.md)**.
