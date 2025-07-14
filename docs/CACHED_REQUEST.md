# How to Add a Cached Request in Penguinmails Dashboard

This guide explains how to use the client-side cache system for API/data requests in the Penguinmails Dashboard app. The cache is powered by a lightweight IndexedDB wrapper (`kvidb`) and exposed via a React Context (`CacheContext`).

## 1. Wrap Your App with CacheProvider

In your `src/App.tsx` or root layout, wrap your app with the `CacheProvider`:

```tsx
import { CacheProvider } from './contexts/CacheContext';

function App() {
  return (
    <CacheProvider>
      {/* ...your routes/components... */}
    </CacheProvider>
  );
}
```

## 2. Use the `useCache` Hook in Your Component

Import the `useCache` hook to access cache methods:

```tsx
import { useCache } from '../contexts/CacheContext';
```

## 3. Create a Cached Request

You can cache any async data (API, DB, etc). Here’s a typical pattern:

```tsx
import { useEffect, useState } from 'react';
import { useCache } from '../contexts/CacheContext';
import { CacheLevel } from '../lib/cache/types';

function MyComponent() {
  const { get, set, isReady } = useCache();
  const [data, setData] = useState(null);
  const cacheKey = 'my-api-request';

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
      const response = await fetch('/api/some-endpoint');
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
await invalidateByPattern('my-api-request');
```

## 5. Advanced: Pattern-based Invalidation

If you use hierarchical keys (e.g., `user:123:profile`), you can invalidate all related cache entries:

```tsx
await invalidateByPattern('user:123*');
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
import { useEffect, useState } from 'react';
import { useCache } from '../contexts/CacheContext';
import { CacheLevel } from '../lib/cache/types';

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
