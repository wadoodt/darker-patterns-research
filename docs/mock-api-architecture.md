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
  import { createTable } from './lib/createTable';
  import { mockUsers } from './_data/users'; // Initial seed data

  export const db = {
    users: createTable(mockUsers),
    // products: createTable(mockProducts),
  };
  ```

### 3.2. Authorization Utility (`utils/auth.ts`)

This module handles authentication and role-based access control for mock endpoints.

- **Purpose**: To centralize authorization logic.
- **Exports**: An `authorize` function.

**`authorize(request, allowedRoles: string[])`**

1.  Extracts the JWT from the `Authorization: Bearer <token>` header of the request.
2.  Uses `db.users.findFirst()` to find a user whose `token` matches.
3.  If no user is found, throws a `401 Unauthorized` error.
4.  If the user's role is not included in `allowedRoles`, throws a `403 Forbidden` error.
5.  If authorized, returns the full user object.

### 3.3. API Handlers (`handlers/`)

Handlers contain the business logic for each API endpoint.

- **Purpose**: To simulate the behavior of a backend controller.
- **Structure**: Each file (e.g., `auth.ts`, `users.ts`) groups related endpoint handlers.

**Example: `handlers/auth.ts`**

```typescript
import { db } from '../db';

// Corresponds to POST /api/auth/login
export const login = async (request) => {
  const { username, password } = await request.json();
  const user = db.users.findFirst({ where: { username } });

  if (!user || user.password !== password) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // Exclude password from the response
  const { password: _, ...userResponse } = user;
  return new Response(JSON.stringify(userResponse), { status: 200 });
};
```

### 3.4. API Resolver (`resolver.ts`)

The resolver is the mock API gateway. It maps incoming requests to the correct handler.

- **Purpose**: To act as a single entry point for all mock API calls, directing traffic.
- **Structure**: It will contain a `routes` object and a `resolve` function.

**`routes` Map**

A simple object mapping a route key (`METHOD /path`) to a handler function.

```typescript
import * as authHandlers from './handlers/auth';

const routes = {
  'POST /api/auth/login': authHandlers.login,
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
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    // The resolver will handle the request and return a Response object.
    const response = await resolve(config);

    // We adapt the Response to an axios-compatible format.
    config.adapter = async () => Promise.resolve({
      data: await response.json(),
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      config: config,
      request: {},
    });
  }
  return config;
});
```

## 4. Usage in Tests (Vitest)

This architecture is highly conducive to testing.

- **State Management**: Test files can import the `db` object directly to set up preconditions or assert outcomes.
- **Isolation**: A `beforeEach` or `afterEach` block in the test setup can call the `db.users._reset()` method to ensure each test runs against a clean, predictable dataset.

**Example: `AuthContext.test.tsx`**

```typescript
import { db } from 'src/api/mocks/db';

afterEach(() => {
  // Reset the database state after each test
  db.users._reset();
});

it('should allow a valid user to log in', () => {
  // No special setup needed if the default mock user is sufficient
  // ... test login logic
});

it('should reject a user with the wrong password', () => {
  // ... test login logic with bad credentials
});
```

## 5. Interaction with Client-Side Caching

The mock API and the client-side caching system are designed to work together seamlessly. The caching layer is completely independent of the data source, meaning it will cache responses from the mock API just as it would from a real backend.

- **No Special Configuration Needed**: When mocks are enabled (`VITE_USE_MOCKS=true`), the `useAsyncCache` hook will automatically fetch data from the mock API via the `axios` interceptor. The response is then cached as usual.
- **Realistic Development**: This allows developers to build and test features with realistic loading states and data persistence, all without needing a live backend.
- **Debugging**: The **Cache Management Panel** on the profile page can be used to inspect data provided by the mock API, making it easy to verify that your mock handlers are returning the correct data structures.

## 6. Related Documentation

- **[Client-Side Caching: A Developer's Guide](./CACHED_REQUEST.md)**: For a deep dive into the caching system.
- **[Endpoint Integration Guide](./ENDPOINT_INTEGRATION.md)**: For a step-by-step guide on how to use this mock architecture to add new API endpoints.
- **[API Response & Error Handling](./ERROR_HANDLING.md)**: To understand how mock handlers should structure their success and error responses.
