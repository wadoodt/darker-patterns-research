# Technical Documentation: Frontend Mock API Architecture

## 1. Overview

This document outlines the architecture for a dynamic, stateful, and test-friendly mock API for the frontend application. The primary goal is to create a mocking layer that closely emulates a real backend, complete with a database, authentication, and complex query capabilities. This allows for robust development and testing without a dependency on a live backend.

The architecture is designed to be ORM-agnostic but will mimic the query style of **Drizzle ORM** for familiarity and a seamless transition to a real backend.

## 2. Directory Structure

The mock API code will reside within `src/api/mocks/`.

```
src/api/mocks/
├── lib/                  # Core factory for creating DB tables
│   └── createTable.ts
├── handlers/             # Logic for specific API endpoints (e.g., auth, users)
│   ├── auth.ts
│   └── ...
├── utils/                # Shared utilities, like authentication
│   └── auth.ts
├── db.ts                 # Instantiation of the mock database tables
└── resolver.ts           # Central router to map requests to handlers
```

## 3. Core Components

### 3.1. Mock Database (`lib/createTable.ts` and `db.ts`)

This is the heart of the mock system, providing a stateful, in-memory data store.

#### `lib/createTable.ts`

This file will export a generic factory function, `createTable<T>(initialData: T[])`, responsible for creating a mock database table from an array of objects.

- **Purpose**: To abstract the logic of querying and mutating an in-memory array of data.
- **Returns**: An object with methods that mimic Drizzle ORM's syntax.

**Methods:**

- `findFirst({ where: { key: value } })`: Finds the first record matching the `where` clause.
- `findMany({ where, page, limit, orderBy })`: Finds all records matching the `where` clause. Supports pagination (`page`, `limit`), sorting (`orderBy: { field: 'asc' | 'desc' }`), and text search (`query`).
- `create({ data })`: Adds a new record to the table. It will automatically handle ID generation.
- `update({ where, data })`: Finds a record matching `where` and updates it with `data`.
- `delete({ where })`: Deletes a record matching the `where` clause.
- `_reset()`: A utility function for tests to reset the table to its initial state.

#### `db.ts`

This file serves as the central database instance.

- **Purpose**: To use the `createTable` factory to instantiate all the necessary data models for the application (e.g., users, products, etc.).
- **Example**:

  ```typescript
  import { createTable } from "./lib/createTable";
  import { mockUsers } from "./_data/users"; // Initial seed data

  export const db = {
    users: createTable(mockUsers),
    // products: createTable(mockProducts),
  };
  ```

### 3.2. Authorization Utility (`utils/auth.ts`)

This module handles authentication and role-based access control for mock endpoints.

- **Purpose**: To centralize authorization logic and validate JWT tokens.
- **Exports**: An `authorize` function that validates tokens and user permissions.

**`authorize(request, allowedRoles: string[])`**

1.  Extracts the JWT from the `Authorization: Bearer <token>` header of the request.
2.  Uses `db.users.findFirst()` to find a user whose `token` matches.
3.  If no user is found, throws a `401 Unauthorized` error.
4.  If the user's role is not included in `allowedRoles`, throws a `403 Forbidden` error.
5.  If authorized, returns the full user object.

```typescript
import { authorize } from "../utils/auth";

export const protectedEndpoint = async (request: Request) => {
  try {
    // Validate authentication and role
    const user = await authorize(request, ["user", "admin"]);
    
    // Your endpoint logic here
    return new Response(JSON.stringify({ data: "protected data" }));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401 
    });
  }
};
```

### 3.3. API Handlers (`handlers/`)

Handlers contain the business logic for each API endpoint.

- **Purpose**: To simulate the behavior of a backend controller.
- **Structure**: Each file (e.g., `auth.ts`, `users.ts`) groups related endpoint handlers.

**Example: `handlers/auth.ts`**

```typescript
import { db } from "../db";

// Corresponds to POST /api/auth/login
export const login = async (request: Request) => {
  const { username, password } = await request.json();
  const user = db.users.findFirst({ where: { username } });

  if (!user || user.password !== password) {
    return new Response("Invalid credentials", { status: 401 });
  }

  // Generate tokens
  const token = `mock-token-for-id-${user.id}`;
  const refreshToken = `mock-refresh-token-for-id-${user.id}`;
  const expiresIn = 86400; // 24 hours

  // Update user with tokens
  db.users.update({
    where: { id: user.id },
    data: { token, refreshToken }
  });

  // Return login response
  const { password: _, ...userResponse } = user;
  return new Response(JSON.stringify({
    user: userResponse,
    token,
    refreshToken,
    expiresIn,
    notifications: { unread: [] }
  }));
};

// Corresponds to POST /api/auth/refresh-token
export const refreshToken = async (request: Request) => {
  const { refreshToken } = await request.json();
  
  // Find user by refresh token
  const user = db.users.findFirst({ 
    where: { refreshToken } 
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), { 
      status: 401 
    });
  }

  // Generate new tokens
  const newToken = `mock-token-for-id-${user.id}`;
  const newRefreshToken = `mock-refresh-token-for-id-${user.id}`;
  const expiresIn = 86400;

  // Update user with new tokens
  db.users.update({
    where: { id: user.id },
    data: { token: newToken, refreshToken: newRefreshToken }
  });

  return new Response(JSON.stringify({
    accessToken: newToken,
    refreshToken: newRefreshToken,
    expiresIn
  }));
};
```

### 3.4. Standardized Pagination

All list endpoints in the mock API implement consistent pagination using the `createPagedResponse` utility. This ensures a uniform response format and behavior across all endpoints that return collections of items.

**Key Features:**
- Consistent query parameters: `page` (1-based) and `limit`
- Standardized response format:
  ```typescript
  {
    [domain]: T[],  // The paginated data array
    currentPage: number,
    totalPages: number,
    total: number
  }
  ```
- Built-in support for filtering and sorting
- Automatic calculation of pagination metadata

**Implementation:**
- Located in `src/api/mocks/utils/paged-response.ts`
- Used by all collection endpoints (users, companies, support tickets, etc.)
- Handles edge cases (e.g., out-of-bounds page numbers)

**Example Usage:**
```typescript
// In a handler function
return createPagedResponse({
  table: 'users',
  page: parseInt(url.searchParams.get('page') || '1', 10),
  limit: parseInt(url.searchParams.get('limit') || '10', 10),
  domain: 'users',
  where: { active: true },
  orderBy: { createdAt: 'desc' }
});
```

### 3.5. API Resolver (`resolver.ts`)

The resolver is the mock API gateway. It maps incoming requests to the correct handler.

- **Purpose**: To act as a single entry point for all mock API calls, directing traffic.
- **Structure**: It will contain a `routes` object and a `resolve` function.

**`routes` Map**

A simple object mapping a route key (`METHOD /path`) to a handler function.

```typescript
import * as authHandlers from "./handlers/auth";

const routes = {
  "POST /api/auth/login": authHandlers.login,
  "POST /api/auth/refresh-token": authHandlers.refreshToken,
  "POST /api/auth/logout": authHandlers.logout,
  // 'GET /api/users': userHandlers.getUsers,
};
```

**`resolve(request)` Function**

1.  Constructs a route key from the request's method and URL pathname.
2.  Looks up the corresponding handler in the `routes` map.
3.  If a handler is found, it executes it and returns its response. Otherwise, it returns a `404 Not Found` error.

### 3.5. API Client Integration (`src/api/client.ts`)

The final step is to hook the resolver into our `axios` client.

- **Purpose**: To intercept outgoing requests and redirect them to the mock resolver when mocks are enabled.
- **Logic**: The `axios` request interceptor will be modified.

```typescript
apiClient.interceptors.request.use(async (config) => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    // Create a new Request object from the axios config
    const request = new Request(config.url, {
      method: config.method.toUpperCase(),
      body: config.data ? JSON.stringify(config.data) : null,
      headers: config.headers,
    });

    // The resolver will handle the request and return a Response object.
    const response = await resolve(request);

    // We adapt the Response to an axios-compatible format.
    config.adapter = async () => {
      const responseBody = await response.text();
      const data = responseBody ? JSON.parse(responseBody) : null;

      return Promise.resolve({
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config: config,
        request: {},
      });
    };
  }
  return config;
});
```

## 4. Authentication Flow in Mock Environment

The mock environment fully supports the complete authentication flow:

### 4.1. Login Flow

1. **User submits credentials** → `POST /api/auth/login`
2. **Mock handler validates credentials** → Checks against mock database
3. **Tokens generated** → Access token, refresh token, and expiration
4. **Tokens stored** → Updated in mock database and returned to client
5. **Client stores tokens** → Using `TokenService.setTokens()`

### 4.2. Token Refresh Flow

1. **API call fails with 401** → API client interceptor catches this
2. **Refresh token sent** → `POST /api/auth/refresh-token`
3. **Mock handler validates refresh token** → Checks against mock database
4. **New tokens generated** → Token rotation (new refresh token)
5. **Client updates tokens** → Using `TokenService.updateAccessToken()`
6. **Original request retried** → With new access token

### 4.3. Token Validation

Mock handlers can validate tokens using the `authorize` utility:

```typescript
import { authorize } from "../utils/auth";

export const protectedEndpoint = async (request: Request) => {
  // This will validate the token and check user role
  const user = await authorize(request, ["user", "admin"]);
  
  // If we get here, the user is authenticated and authorized
  return new Response(JSON.stringify({ data: "protected data" }));
};
```

## 5. Usage in Tests (Vitest)

This architecture is highly conducive to testing.

- **State Management**: Test files can import the `db` object directly to set up preconditions or assert outcomes.
- **Isolation**: A `beforeEach` or `afterEach` block in the test setup can call the `db.users._reset()` method to ensure each test runs against a clean, predictable dataset.

**Example: `AuthContext.test.tsx`**

```typescript
import { db } from "src/api/mocks/db";

afterEach(() => {
  // Reset the database state after each test
  db.users._reset();
});

it("should allow a valid user to log in", () => {
  // No special setup needed if the default mock user is sufficient
  // ... test login logic
});

it("should reject a user with the wrong password", () => {
  // ... test login logic with bad credentials
});

it("should refresh tokens successfully", () => {
  // Test the complete refresh token flow
  // ... test refresh logic
});
```

## 6. Interaction with Client-Side Caching

The mock API and the client-side caching system are designed to work together seamlessly. The caching layer is independent of the data source, meaning it will cache responses from the mock API just as it would from a real backend.

### How It Works

When mocks are enabled (`VITE_USE_MOCKS=true`), the `axios` interceptor (configured in `src/api/client.ts`) redirects all API requests to the mock resolver. The `useAsyncCache` hook, which uses `axios` under the hood, will therefore automatically fetch from the mock API. The response is then cached as usual.

### Example: Fetching Mock Data with `useAsyncCache`

To fetch and cache data from a mock endpoint, use the `useAsyncCache` hook exactly as you would for a real API. No special configuration is needed.

```typescript
// src/features/dashboard/components/UsersList.tsx
import { useAsyncCache } from "@hooks/useAsyncCache";
import { api } from "@api/client";

// The fetcher function points to a standard API endpoint.
// The mock resolver will intercept this call if mocks are enabled.
const fetchUsers = async () => {
  const response = await api.get("/api/users");
  return response.data;
};

export function UsersList() {
  const { data: users, loading } = useAsyncCache(
    "users-list",
    fetchUsers,
    { level: "PERSISTENT" }
  );

  if (loading) return <p>Loading users...</p>;

  return (
    <ul>
      {users?.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Authentication-Aware Caching

The caching system works seamlessly with authentication:

```typescript
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

### Debugging

The **Cache Management Panel** on the profile page can be used to inspect data provided by the mock API, making it easy to verify that your mock handlers are returning the correct data structures.

## 7. Related Documentation

- **[Client-Side Caching: A Developer's Guide](./CACHED_REQUEST.md)**: For a deep dive into the caching system.
- **[Endpoint Integration Guide](./ENDPOINT_INTEGRATION.md)**: For a step-by-step guide on how to use this mock architecture to add new API endpoints.
- **[API Response & Error Handling](./ERROR_HANDLING.md)**: To understand how mock handlers should structure their success and error responses.
- **[Authentication Troubleshooting](./FAQ.md)**: For common authentication issues and solutions.
