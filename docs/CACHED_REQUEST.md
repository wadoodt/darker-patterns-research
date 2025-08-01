# Client-Side Caching: A Developer's Guide

This guide explains how to use the robust client-side caching system in the Penguinmails Dashboard. The system is built on IndexedDB and is designed for resilience and ease of use, primarily through the `useAsyncCache` hook.

## 1. `CacheProvider` Setup

First, ensure your application is wrapped with the `CacheProvider` in a root component (e.g., `main.tsx` or `App.tsx`). This initializes the cache and makes it available to all child components.

```tsx
import { CacheProvider } from "./contexts/CacheContext";

function App() {
  return (
    <CacheProvider>{/* ...your routes and components... */}</CacheProvider>
  );
}
```

## 2. Fetching Data with `useAsyncCache`

The `useAsyncCache` hook is the primary and recommended way to fetch and cache data. It abstracts away the complexities of cache management, loading states, and error handling.

### Basic Usage

Import the hook and provide a unique `cacheKey` and an async `fetcher` function.

```tsx
// src/components/CompaniesList.tsx
import { useAsyncCache } from "@hooks/useAsyncCache";
import { api } from "@api/client";
import { CACHE_TTL } from "@lib/cache/constants";

const fetchCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export function CompaniesList() {
  const {
    data: companies,
    loading,
    error,
    reload,
  } = useAsyncCache(
    "companies-list",
    fetchCompanies,
    { ttl: CACHE_TTL.STANDARD_5_MIN }, // Set a 5-minute cache TTL
  );

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p>Error fetching companies: {error.message}</p>;

  return (
    <div>
      <button onClick={() => reload(true)}>Force Refresh</button>
      <ul>
        {companies?.map((company) => (
          <li key={company.id}>{company.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Hook Parameters

- `cacheKey` (string | (string | number)[]): A unique identifier for this piece of data.
- `fetcher` (function): An async function that returns the data to be cached.
- `options` (object, optional):
  - `ttl`: Time-to-live in **seconds**. Use constants from `CACHE_TTL` for clarity (e.g., `CACHE_TTL.STANDARD_5_MIN`).
  - `enabled`: If `false`, the hook will not execute.
  - `refetchOnMount`: If `true`, forces a refetch every time the component mounts.

## 3. Authentication-Aware Caching

The caching system is designed to work seamlessly with the authentication system. When authentication is required, the cache automatically adjusts its behavior.

### Token-Based TTL Calculation

For authenticated endpoints, you can calculate TTL based on token expiration to ensure cache doesn't outlive the user's session:

```tsx
import { useMemo } from "react";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { getExpiresAt } from "@lib/tokenService";

export function UserProfile() {
  const tokenExpiresAt = getExpiresAt();
  
  // Calculate TTL based on token expiration
  const ttl = useMemo(() => {
    if (!tokenExpiresAt) {
      return CACHE_TTL.STANDARD_5_MIN; // Default fallback
    }
    
    const timeUntilExpiry = tokenExpiresAt - Date.now();
    // Set TTL to 90% of time until expiry, with a minimum of 1 minute
    return Math.max(timeUntilExpiry * 0.9, 60);
  }, [tokenExpiresAt]);

  const { data: user } = useAsyncCache(
    ["user", "me"],
    () => api.get("/users/me").then(res => res.data),
    { 
      ttl,
      enabled: !!tokenExpiresAt // Only fetch if user is authenticated
    }
  );

  return <div>Welcome, {user?.name}!</div>;
}
```

### Authentication-Dependent Caching

The `enabled` option is particularly useful for authentication-dependent data:

```tsx
import { getAccessToken } from "@lib/tokenService";

export function ProtectedData() {
  const token = getAccessToken();
  
  const { data, loading } = useAsyncCache(
    ["protected-data"],
    () => api.get("/protected-endpoint").then(res => res.data),
    { 
      enabled: !!token, // Only fetch if authenticated
      ttl: CACHE_TTL.STANDARD_5_MIN 
    }
  );

  if (!token) {
    return <div>Please log in to view this data</div>;
  }

  if (loading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

## 4. Advanced Features & Resilience

We have made significant improvements to make the cache system more robust.

### Automatic Waiting for Cache Readiness

If the cache is not ready (e.g., IndexedDB is initializing), `useAsyncCache` will **automatically wait** for the `isReady` signal before attempting to retrieve data. It will remain in a `loading` state during this time. This ensures that on navigation, it always consults the persistent cache first, preventing unnecessary API calls if the data is already available.

### Automatic Database Recovery

If the `CacheProvider` detects an IndexedDB versioning error during initialization, it will **automatically delete and recreate the database**. This self-healing mechanism prevents the app from getting stuck in a broken state due to schema mismatches.

## 5. Cache Management & Debugging

To help with development and debugging, we've created a central cache management panel.

- **Location**: Navigate to the **Profile & Settings** page (by clicking your username in the header) to find the **Cache Management** section.
- **Component**: This UI is powered by the `<CacheAdminPanel />` component.

**Features:**

- View all keys and values currently in the cache.
- Manually delete a specific cache entry.
- Clear the entire cache with a single click.

This tool is invaluable for observing cache behavior and ensuring your data is being stored and refreshed correctly.

## 6. Manually Interacting with the Cache

While `useAsyncCache` should be your primary tool, you can directly interact with the cache using the `useCache` hook.

```tsx
import { useEffect, useState } from "react";
import { useCache } from "../contexts/CacheContext";
import { CACHE_TTL } from "@lib/cache/constants";

function MyComponent() {
  const { get, set, isReady } = useCache();
  const [data, setData] = useState(null);
  const cacheKey = "my-api-request";

  useEffect(() => {
    if (!isReady) return;
    (async () => {
      // Try cache first
      const cached = await get(cacheKey);
      if (cached) {
        setData(cached);
        return;
      }
      // Otherwise fetch and cache
      const response = await fetch("/api/some-endpoint");
      const result = await response.json();
      setData(result);
      await set(cacheKey, result, CACHE_TTL.STANDARD_5_MIN); // Set a 5-minute TTL
    })();
  }, [isReady]);

  if (!data) return <div>Loading...</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## 7. Invalidate or Refresh Cache

To force a refresh (e.g., after a mutation), use `invalidateByPattern` from `useCache`.

```tsx
const { invalidateByPattern } = useCache();
await invalidateByPattern("my-api-request");
```

If you are using `useAsyncCache`, you can call the returned `refresh` function.

```tsx
const { refresh } = useAsyncCache(...);
refresh();
```

### Pattern-based Invalidation

If you use hierarchical keys (e.g., `user:123:profile`), you can invalidate all related cache entries:

```tsx
await invalidateByPattern("user:123*");
```

## 8. Understanding TTL (Time To Live)

The `ttl` parameter specifies how long a cache entry should be considered valid, in **seconds**. We provide a set of constants in `src/lib/cache/constants.ts` for common durations:

- `CACHE_TTL.STANDARD_5_MIN`: 5 minutes
- `CACHE_TTL.DEFAULT_15_MIN`: 15 minutes
- `CACHE_TTL.IMPORTANT_1_HOUR`: 1 hour
- `CACHE_TTL.LONG_1_DAY`: 1 day
- `CACHE_TTL.SESSION`: A very long duration, effectively caching for the user's session.

Using these constants improves readability and maintainability. You can also provide a custom `ttl` in seconds for specific needs.

### Authentication-Aware TTL

For authenticated data, consider using token expiration to set TTL:

```tsx
import { getExpiresAt } from "@lib/tokenService";

const tokenExpiresAt = getExpiresAt();
const ttl = tokenExpiresAt 
  ? Math.max((tokenExpiresAt - Date.now()) * 0.9, 60) // 90% of token life, min 1 min
  : CACHE_TTL.STANDARD_5_MIN; // Fallback for unauthenticated requests
```

This ensures that cached data doesn't outlive the user's authentication session.

---

For more advanced cache management, see the `CacheContext.tsx` and related source files.
