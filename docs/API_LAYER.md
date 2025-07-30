# API Layer Architecture Guide

This document outlines the architecture of the application's API layer. The goal is to provide a clean, consistent, and maintainable interface for all backend communication. It follows a "frontend SDK" pattern, abstracting away the complexities of HTTP requests and data caching, providing a type-safe, domain-driven API of React hooks.

---

## 1. Core Concepts

The API layer is divided into three main parts:

1.  **The API Functions (`src/api/domains/.../index.ts`):** Raw, async functions that perform the actual `axios` calls. These are the pure communication layer and should be considered an internal implementation detail.
2.  **The API Utilities (`src/api/lib/`):** A set of shared utilities (`handleQuery`, `handleMutation`) that standardize error handling, logging, and request processing.
3.  **The API Hooks (`src/api/domains/.../hooks.ts`):** A set of custom React hooks that serve as the **public interface** for the API layer. The rest of the application should **only** interact with the API through these hooks.

---

## 2. Using the API SDK

All interactions with the API should go through the hooks exported from the main `api` object.

### Fetching Data with Query Hooks

Query hooks (e.g., `api.notifications.useNotificationsQuery()`) are built on top of our custom `useAsyncCache` hook. They handle fetching, caching, loading states, and errors automatically.

```tsx
import api from "@api";
import { useTranslation } from "react-i18next";

function NotificationsBell() {
  const { t } = useTranslation();
  // The component just needs to call the hook. Caching is handled inside.
  const { data, error, loading } = api.notifications.useNotificationsQuery(1, { enabled: true });

  if (loading) return <span>Loading...</span>;
  if (error) return <span>{t(error.message)}</span>;

  return <span>{data.total} Notifications</span>;
}
```

### Updating Data with Mutation Functions

Mutation functions (e.g., `api.notifications.markAsRead()`) are simple async functions that should be called from event handlers. They return the full `ApiResponse` object, giving you access to validation errors for form handling.

```tsx
const handleMarkAsRead = async (id: string) => {
  const response = await api.notifications.markAsRead(id);

  if (response.error) {
    // Show a toast notification on failure
    // sonner.error(t(response.error.message));
  } else {
    // Invalidate the query cache to refresh the UI
    // await invalidateByPattern('^notifications');
  }
};
```

This architecture provides a clean, powerful, and consistent pattern for all data fetching and state management across the application.

---

## 3. How to Add a New API Domain

Adding a new domain (e.g., "billing") is straightforward:

**1. Create the Domain Directory:**

`mkdir src/api/domains/billing`

**2. Define the Types (`domains/billing/types.ts`):**

Define the public-facing types for the domain.

**3. Create the Raw API Functions (`domains/billing/index.ts`):**

Create the async functions that make the `apiClient` calls. Use `handleQuery` for data retrieval and `handleMutation` for data modification.

**4. Create the Custom Hooks (`domains/billing/hooks.ts`):**

For every query function, create a corresponding custom hook that wraps `useAsyncCache`. This is what the UI will consume.

```ts
// src/api/domains/billing/hooks.ts
export const useBillingQuery = (invoiceId: string) => {
  return useAsyncCache(["billing", invoiceId], () => billing.query(invoiceId));
};
```

**5. Add the Domain to the Main API (`src/api/index.ts`):**

Import and export the new functions and hooks from the main `api` object.

```ts
// src/api/index.ts
import { billing } from "./domains/billing";
import * as billingHooks from "./domains/billing/hooks";

// ...
const api = {
  // ...
  billing: {
    ...billing,
    ...billingHooks,
  },
};
```
**6. Re-export the Types (`src/api/types.ts`)**
**7. Add Mock Handlers**
