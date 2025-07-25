# Standardized CRUD Implementation Guide

This guide provides a comprehensive, step-by-step process for implementing Create, Read, Update, and Delete (CRUD) functionality in this application. We use the **Team Management** feature as a practical example.

Following this guide ensures consistency, maintainability, and scalability across all features.

## Core Principles

1.  **Centralized Hooks**: Each feature (e.g., Team, Articles) must have a central hook (e.g., `useTeamPage.ts`) that acts as a single source of truth. This hook manages all state, data fetching, and mutation logic for that feature.

2.  **Separate Views for Mutations**: To keep components focused, mutation operations (Create, Update) must be handled in separate pages or modals. The main list view should only display data and trigger actions.

3.  **Efficient Cache Handling**: We use `useAsyncCache` for performance. After any mutation (Create, Update, or Delete), we must invalidate the relevant cache entries to ensure the UI reflects the changes.

    *   **Best Practice: Invalidate by Pattern**: The most robust method is to use the `invalidateByPattern` function from our `useCache` hook. This function can clear all cache entries matching a pattern (e.g., all pages of a list) with a single call, preventing stale data across the application.

---

## Step-by-Step Implementation

### Step 1: Define TypeScript Types

All API payloads and responses must be strongly typed.

1.  **Create/Update Type File**: In `src/types/api/`, define the types for your feature (e.g., `src/types/api/team.ts`).

    ```typescript
    // src/types/api/team.ts
    export interface TeamMember {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'user';
      status: 'active' | 'invited';
      lastActive: string;
    }

    export interface NewTeamMember extends Omit<TeamMember, 'id' | 'status' | 'lastActive'> {}
    ```

2.  **Export from Index**: Export the new types from `src/types/api/index.ts` to make them easily accessible throughout the app.

    ```typescript
    // src/types/api/index.ts
    export type { TeamMember, TeamMembersResponse, NewTeamMember } from "./team";
    ```

### Step 2: Implement Mock API Handlers

Before building the UI, create mock handlers for all CRUD operations.

1.  **Create Handler File**: In `src/api/mocks/handlers/`, create a file for your feature (e.g., `team.ts`). Implement functions for `GET`, `POST`, `PATCH`, and `DELETE`.

    ```typescript
    // src/api/mocks/handlers/team.ts
    import { db } from "../db";
    import { createSuccessResponse, createErrorResponse } from "../../response";

    // GET handler (with pagination)
    export const getTeamMembers = (request: Request) => { /* ... */ };

    // POST handler
    export const createTeamMember = async (request: Request) => { /* ... */ };

    // DELETE handler
    export const deleteTeamMember = async (_request: Request, { params }) => { /* ... */ };
    ```

2.  **Register Routes**: In `src/api/mocks/resolver.ts`, import your handlers and add them to the `routes` array.

    ```typescript
    // src/api/mocks/resolver.ts
    import * as teamHandlers from "./handlers/team";

    const routes: Array<[string, RegExp, unknown]> = [
      // ... other routes
      ["POST /api/team", /^\/api\/team$/, teamHandlers.createTeamMember],
      ["GET /api/team", /^\/api\/team$/, teamHandlers.getTeamMembers],
      ["DELETE /api/team/:id", /^\/api\/team\/([^/]+)$/, teamHandlers.deleteTeamMember],
    ];
    ```

### Step 3: Build the Central Hook

This is the most critical piece. The hook orchestrates everything.

1.  **Create Hook File**: In your feature directory, create the hook (e.g., `src/features/dashboard/pages/team/hooks/useTeamPage.ts`).

2.  **Fetch Data with `useAsyncCache`**: Use the hook to fetch data and manage state.

    ```typescript
    // useTeamPage.ts
        // src/features/dashboard/pages/team/hooks/useTeamPage.ts
    const { invalidateByPattern } = useCache();
    const { data, loading, error } = useAsyncCache(
      ["team-members", currentPage],
      () => fetchTeamMembers(currentPage),
      CacheLevel.DEBUG
    );
    ```

3.  **Implement Mutation Handlers**: Add async functions for each mutation. These functions will call the API and handle the response.

    ```typescript
    // useTeamPage.ts
        const handleCreateMember = async (member: NewTeamMember) => {
      await api.post("/team", member);
      await invalidateByPattern("^team-members");
    };

    const handleDeleteMember = async (memberId: string) => {
      await api.delete(`/team/${memberId}`);
      await invalidateByPattern("^team-members");
    };
    ```

4.  **Return State and Handlers**: Expose all necessary state and functions from the hook.

### Step 4: Implement Routing

Add routes for your new pages in the main router configuration.

```tsx
// src/pages/dashboard/DashboardPage.tsx
<Route path="/team/new" element={
  <ProtectedRoute roles={['admin', 'super-admin']}>
    <CreateTeamMemberPage />
  </ProtectedRoute>
} />
```

### Step 5: Build the UI

Finally, create the React components to interact with your hook.

1.  **Main Page (`TeamPage.tsx`)**: This component consumes the central hook and passes data and handlers down to its children.

    ```tsx
    // TeamPage.tsx
    const { teamMembers, handleDeleteMember } = useTeamPage();

    return (
      <TeamMembersTableSection 
        members={teamMembers}
        onDeleteMember={handleDeleteMember}
      />
    );
    ```

2.  **Create/Edit Form (`CreateTeamMemberPage.tsx`)**: A form that uses a mutation handler from the hook and navigates on success.

    ```tsx
    // CreateTeamMemberPage.tsx
    const { handleCreateMember } = useTeamPage();
    const navigate = useNavigate();

        const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await handleCreateMember(formData);
      navigate("/team"); // Navigate back to the list
    };
    ```

3.  **Confirmation Modal (`DeleteMemberModal.tsx`)**: A reusable modal to prevent accidental deletions. It should be generic and receive `onConfirm` and `onClose` handlers.

By following this structured approach, we ensure that all CRUD implementations are robust, maintainable, and consistent across the application.
