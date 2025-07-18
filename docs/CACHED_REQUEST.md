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
    { level: "PERSISTENT" }, // Cache level
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

- `cacheKey` (string): A unique identifier for this piece of data.
- `fetcher` (function): An async function that returns the data to be cached.
- `options` (object, optional):
  - `level`: `'SESSION'` (cleared on tab close) or `'PERSISTENT'` (persists across sessions).
  - `ttl`: Custom time-to-live in milliseconds.
  - `enabled`: If `false`, the hook will not execute.

## 3. Advanced Features & Resilience

We have made significant improvements to make the cache system more robust.

### Automatic Fallback

If the cache is not ready (e.g., IndexedDB is initializing) or a cache read fails, `useAsyncCache` will **automatically bypass the cache** and execute the `fetcher` function directly. This ensures that the user can still see data even if the caching system encounters an issue.

### Automatic Database Recovery

If the `CacheProvider` detects an IndexedDB versioning error during initialization, it will **automatically delete and recreate the database**. This self-healing mechanism prevents the app from getting stuck in a broken state due to schema mismatches.

## 4. Cache Management & Debugging

To help with development and debugging, we've created a central cache management panel.

- **Location**: Navigate to the **Profile & Settings** page (by clicking your username in the header) to find the **Cache Management** section.
- **Component**: This UI is powered by the `<CacheAdminPanel />` component.

**Features:**

- View all keys and values currently in the cache.
- Manually delete a specific cache entry.
- Clear the entire cache with a single click.

This tool is invaluable for observing cache behavior and ensuring your data is being stored and refreshed correctly.

```tsx
import { useEffect, useState } from "react";
import { useCache } from "../contexts/CacheContext";
import { CacheLevel } from "../lib/cache/types";

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
      await set(cacheKey, result, CacheLevel.STANDARD); // or another level
    })();
  }, [isReady]);

  if (!data) return <div>Loading...</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## 4. Invalidate or Refresh Cache

To force a refresh (e.g., after a mutation), use `invalidateByPattern`:

```tsx
const { invalidateByPattern } = useCache();
await invalidateByPattern("my-api-request");
```

## 5. Advanced: Pattern-based Invalidation

If you use hierarchical keys (e.g., `user:123:profile`), you can invalidate all related cache entries:

```tsx
await invalidateByPattern("user:123*");
```

## 6. TTL and Cache Levels

Choose a `CacheLevel` for each request:

- `STANDARD`: 1 hour
- `PERSISTENT`: 30 days
- `SESSION`: 30 minutes

You can also pass a custom TTL in milliseconds to `set`.

## 7. Example: Cached API Hook

You can abstract the pattern above into a custom hook:

```tsx
import { useEffect, useState } from "react";
import { useCache } from "../contexts/CacheContext";
import { CacheLevel } from "../lib/cache/types";

export function useCachedApi(key, fetcher, level = CacheLevel.STANDARD) {
  const { get, set, isReady } = useCache();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    (async () => {
      setLoading(true);
      const cached = await get(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
      const result = await fetcher();
      setData(result);
      await set(key, result, level);
      setLoading(false);
    })();
  }, [isReady, key]);

  return { data, loading };
}
```

---

For more advanced cache management, see the `CacheContext.tsx` and `types.ts` for available methods and cache levels.
