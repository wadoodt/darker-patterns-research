# API Layer Architecture Guide

This document outlines the architecture of the application's API layer. The goal is to provide a clean, consistent, and maintainable interface for all backend communication. It follows a "frontend SDK" pattern, abstracting away the complexities of HTTP requests and data caching, providing a type-safe, domain-driven API of React hooks.

---

## 1. Core Concepts

The API layer is divided into three main parts:

1.  **The API Functions (`src/api/domains/.../index.ts`):** Raw, async functions that perform the actual `apiClient` calls. These are the pure communication layer and should be considered an internal implementation detail. They use the `handleQuery` and `handleMutation` utilities to standardize error handling.
2.  **The API Hooks (`src/api/domains/.../hooks.ts`):** A set of custom React Query hooks that serve as the **public interface** for the API layer. The rest of the application should **only** interact with the API through these hooks.
3.  **The API Types (`src/api/domains/.../types.ts`):** TypeScript definitions for the data structures used by the domain.

---

## 2. Caching Strategy

The API layer features a robust, centralized caching strategy built around the `useAsyncCache` hook. The system is designed to be consistent, predictable, and easy to manage.

### 2.1. Cache Key Management (`src/api/cacheKeys.ts`)

To ensure consistency and type safety, all cache keys **must** be generated using the centralized `cacheKeys` factory. This provides a single source of truth for all cache keys in the application.

#### Key Structure
- **Pattern**: `[domain, resource, id/params]`
- **Examples**:
  - `['users', 'me']` - Current user's profile
  - `['team', 'members', 1, 10]` - First page of team members (10 per page)
  - `['support', 'tickets', 'ticket-123']` - Specific support ticket

#### Key Factory Features
- **Type Safety**: All keys are strongly typed
- **TTL Management**: Each key includes appropriate TTL settings
- **Namespacing**: Keys are automatically prefixed to prevent collisions
- **Consistency**: Enforces consistent key patterns across the application

```typescript
// Example from src/api/cacheKeys.ts
export const cacheKeys = {
  users: {
    // Current user's profile (uses token-based TTL)
    me: () => ({
      key: ["users", "me"],
      ttl: 5 * 60 * 1000, // 5 minutes
    }),
  },
  team: {
    // Paginated team members
    members: (page: number, limit: number) => ({
      key: ["team", "members", page, limit],
      ttl: 5 * 60 * 1000, // 5 minutes
    }),
    // Single team member
    member: (id: string) => ({
      key: ["team", "member", id],
      ttl: 15 * 60 * 1000, // 15 minutes
    }),
  },
  // ... other domains
};
```

#### Best Practices
1. **Never hardcode cache keys** - Always use the `cacheKeys` factory
2. **Group related keys** under the same domain
3. **Include TTL** based on data volatility
4. **Use descriptive names** that match the resource being cached

### 2.2. Cache Invalidation

Cache invalidation is handled through the `CacheContext` using the `invalidateCacheKeys` function. This ensures consistent and reliable cache management across the application.

#### Invalidation Methods

1. **Single Key Invalidation**
   ```typescript
   // In hooks.ts
   const { invalidateCacheKeys } = useCache();
   
   // Invalidate a specific key
   await invalidateCacheKeys(['users', 'me']);
   ```

2. **Prefix-based Invalidation**
   ```typescript
   // Invalidate all team-related cache entries
   await invalidateCacheKeys(['team']);
   
   // Invalidate all paginated team members
   await invalidateCacheKeys(['team', 'members']);
   ```

3. **After Mutations**
   Always invalidate relevant cache entries after mutations to ensure UI consistency:
   ```typescript
   const updateUser = async (userId: string, data: UserData) => {
     const updatedUser = await api.updateUser(userId, data);
     await invalidateCacheKeys(['users', 'me']);
     return updatedUser;
   };
   ```

#### Invalidation Patterns

1. **Single Entity Update**
   - Invalidate the specific entity and any list views that include it
   
2. **List Updates**
   - Invalidate all pagination pages for the list
   - Consider using `invalidateCacheKeys` with a prefix
   
3. **Related Data**
   - When data in one domain affects another, invalidate all related cache entries
   - Example: Updating a user's role might affect team member lists

#### Debugging Cache Issues

1. **Enable Debug Mode**
   Set `API_DEBUG_MODE=true` in your environment to see cache operations in the console.

2. **Check Cache State**
   Use the `CacheAdminPanel` component to inspect and manage the cache during development.

3. **Common Issues**
   - **Stale Data**: Ensure all mutations properly invalidate affected queries
   - **Memory Leaks**: Check for unbounded cache growth in long-running sessions
   - **Race Conditions**: Use the built-in request deduplication in `useAsyncCache`

This system provides the foundation for advanced features like the cache inspection and invalidation tools in the Admin Panel (see tasks #14, #15, #16).

---

## 3. Authentication & Token Management

The application uses a robust JWT-based authentication system with automatic token refresh and centralized token management.

### 2.1. TokenService (`src/lib/tokenService.ts`)

The `TokenService` provides centralized token management with the following key features:

- **Functional Design**: Pure functions for better tree-shaking and performance
- **Event-Driven**: Custom events for token change notifications
- **Type Safety**: Proper TypeScript types for all operations
- **Automatic Cleanup**: Proper token removal and state synchronization

```typescript
import { 
  getAccessToken, 
  setTokens, 
  removeTokens, 
  validateToken,
  onTokenChange 
} from "@lib/tokenService";

// Get current access token
const token = getAccessToken();

// Set tokens (login)
setTokens({
  accessToken: "jwt_token",
  refreshToken: "refresh_token", 
  expiresAt: Date.now() + 3600000
});

// Remove tokens (logout)
removeTokens();

// Validate token
const validation = validateToken();
if (validation.isExpired) {
  // Handle expired token
}

// Listen for token changes
const cleanup = onTokenChange((event) => {
  console.log('Token changed:', event.detail);
});
```

### 2.2. API Client Authentication (`src/api/client.ts`)

The API client automatically handles authentication through interceptors:

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header
- Uses `TokenService.getAccessToken()` for token retrieval

**Response Interceptor:**
- Catches 401 Unauthorized errors
- Automatically attempts token refresh
- Queues concurrent requests during refresh
- Supports token rotation (new refresh tokens)

```typescript
// Automatic token refresh example
apiClient.get('/protected-endpoint')
  .then(response => {
    // Request succeeded
  })
  .catch(error => {
    if (error.response?.status === 401) {
      // Token refresh was attempted automatically
      // If refresh failed, user will be redirected to login
    }
  });
```

### 2.3. AuthContext Integration

The `AuthContext` integrates with `TokenService` for seamless authentication state management:

- **Continuous Validation**: Checks token validity every minute
- **Proactive Refresh**: Refreshes tokens 5 minutes before expiry
- **Event Synchronization**: Listens for token changes from TokenService
- **Automatic Cleanup**: Handles token expiration gracefully

```typescript
import { useAuth } from "@hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <Dashboard user={user} />;
}
```

---

## 3. Using the API SDK

All interactions with the API should go through the hooks exported from each domain.

### Fetching Data with Query Hooks

Query hooks (e.g., `useFaqs`) are built on top of React Query's `useQuery`. They handle fetching, caching, loading states, and errors automatically.

```tsx
import { useFaqs } from "@api/domains/faq/hooks";
import { useTranslation } from "react-i18next";

function FaqSection() {
  const { t } = useTranslation();
  const { data, error, isLoading } = useFaqs("home");

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>{t(error.message)}</span>;

  return (
    <div>
      {data.map((faq) => (
        <div key={faq.id}>{faq.translations.en.question}</div>
      ))}
    </div>
  );
}
```

### Updating Data with Mutation Hooks

Mutation hooks (e.g., `useCreateFaq`) are built on top of React Query's `useMutation`. They provide a simple way to create, update, and delete data, while also handling loading and error states.

```tsx
import { useCreateFaq } from "@api/domains/faq/hooks";

const AddFaqForm = () => {
  const { mutate: createFaq, isLoading } = useCreateFaq();

  const handleSubmit = (faqData) => {
    createFaq(faqData, {
      onSuccess: () => {
        // Invalidate the query cache to refresh the UI
      },
      onError: (error) => {
        // Show a toast notification on failure
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};
```

### Authentication-Aware Data Fetching

For endpoints that require authentication, the API client automatically handles token management:

```tsx
import { useUser } from "@api/domains/users/hooks";

function UserProfile() {
  // This hook automatically handles authentication
  // It will only fetch data if a valid token exists
  const { data: user, loading, error } = useUser();

  if (loading) return <span>Loading user...</span>;
  if (error) return <span>Error loading user</span>;

  return <div>Welcome, {user.name}!</div>;
}
```

This architecture provides a clean, powerful, and consistent pattern for all data fetching and state management across the application.

---

## 4. How to Add a New API Domain

Adding a new domain (e.g., "billing") is straightforward:

**1. Create the Domain Directory:**

`mkdir src/api/domains/billing`

**2. Define the Types (`domains/billing/types.ts`):**

Define the public-facing types for the domain.

**3. Create the Raw API Functions (`domains/billing/index.ts`):**

Create the async functions that make the `apiClient` calls. Use `handleQuery` for data retrieval and `handleMutation` for data modification.

**4. Create the Custom Hooks (`domains/billing/hooks.ts`):**

For every API function, create a corresponding custom hook that wraps `useQuery` or `useMutation`. This is what the UI will consume.

```ts
// src/api/domains/billing/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { billing } from ".";

export const useBillingQuery = (invoiceId: string) => {
  return useQuery({
    queryKey: ["billing", invoiceId],
    queryFn: () => billing.query(invoiceId)
  });
};
```

**5. Add Mock Handlers**

Create or update mock handlers in `src/api/mocks/handlers` to simulate the new API endpoints for development and testing.

**6. Consider Authentication Requirements**

If your new domain requires authentication:

- The API client will automatically add authentication headers
- Mock handlers should validate tokens using the auth utilities
- Consider token expiration in your mock responses

```typescript
// Example: Protected endpoint in mock handler
import { authorize } from "../utils/auth";

export const getBillingData = async (request: Request) => {
  // Validate authentication
  const user = await authorize(request, ["user", "admin"]);
  
  // Your endpoint logic here
  return new Response(JSON.stringify(billingData));
};
```

---

## 5. Authentication Best Practices

### 5.1. Token Storage

- **Access Tokens**: Stored in localStorage for persistence
- **Refresh Tokens**: Stored in localStorage (consider httpOnly cookies for production)
- **Expiration**: Stored as timestamp for validation

### 5.2. Error Handling

- **401 Errors**: Automatically handled by API client
- **Token Expiration**: Proactive refresh prevents user disruption
- **Network Errors**: Graceful degradation with retry logic

### 5.3. Security Considerations

- **Token Rotation**: Refresh tokens are rotated on each refresh
- **Automatic Cleanup**: Tokens are removed on logout/expiration
- **Concurrent Requests**: Queuing prevents duplicate refresh attempts

### 5.4. Development Workflow

- **Mock Environment**: Full authentication flow supported in mocks
- **Token Validation**: Mock handlers validate tokens like real backend
- **Testing**: Easy to test authentication scenarios with mock data
