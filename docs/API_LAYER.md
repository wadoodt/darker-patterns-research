# API Layer Architecture Guide

This document outlines the architecture of the application's API layer. The goal is to provide a clean, consistent, and maintainable interface for all backend communication. It follows a "frontend SDK" pattern, abstracting away the complexities of HTTP requests and providing a type-safe, domain-driven API.

---

## 1. Core Concepts

The API layer is divided into three main parts:

1.  **The API Client (`src/api/client.ts`):** A low-level `axios` instance responsible for the "how" of making HTTP requests.
2.  **The API Utilities (`src/api/lib/`):** A set of shared utilities that standardize error handling, logging, and request processing.
3.  **The API Domain SDK (`src/api/domains/`):** The primary interface for the rest of the application. This is the **only** way UI components should interact with the backend.

---

## 2. The Request Lifecycle & Error Handling

We differentiate between two types of API operations: **Queries** and **Mutations**.

### `handleRequest` Utility

All SDK methods use a central `handleRequest` utility (`src/api/lib/handleRequest.ts`). This function is the heart of our error handling strategy. It:
- Wraps every `axios` call in a `try...catch` block.
- Catches low-level network/server errors and normalizes them into our standard `ApiResponse` format.
- Provides a central place for debug logging (controlled by `API_DEBUG_MODE` in `src/api/config.ts`).
- Includes a placeholder for future global toast notifications (e.g., using `sonner`).

### Query Methods (e.g., `api.team.query()`)

-   **Purpose**: Fetching data.
-   **Behavior**: They are designed to be used with data-fetching hooks like `useAsyncCache` or React Query.
-   **Return Value**: On success, they return the **unwrapped data payload** directly (e.g., `TeamMembersResponse`). On failure, they **throw a custom `ApiError`**.
-   **Usage in UI**:

```tsx
import { useAsyncCache } from "@hooks/useAsyncCache";
import { ApiError } from "@api/lib/ApiError";

const { data, error } = useAsyncCache("team-members", () => api.team.query());

if (error instanceof ApiError) {
  // error.message contains the i18n key for a user-friendly message
  // error.validations would be available if the query had validation rules
  return <span>{t(error.message)}</span>;
}
```

### Mutation Methods (e.g., `api.team.create()`)

-   **Purpose**: Creating, updating, or deleting data, typically from a form.
-   **Behavior**: They are designed to give the UI full context about the result of the operation, especially validation errors.
-   **Return Value**: They **always return the full `ApiResponse<T>` object**. They do **not** throw errors.
-   **Usage in UI**:

```tsx
const [errors, setErrors] = useState(null);

const handleSubmit = async (formData) => {
  const response = await api.team.create(formData);

  if (response.error) {
    // The API response contains validation errors for the form.
    setErrors(response.error.validations);
  } else {
    // Success! Close modal, refresh data, etc.
  }
};
```

This dual approach provides a clean, predictable, and powerful way to interact with the API across the entire application.

---

## 3. How to Add a New API Domain

Adding a new domain (e.g., "billing") is straightforward:

**1. Create the Domain Directory:**

Create a new folder inside `src/api/domains`.

```bash
mkdir src/api/domains/billing
```

**2. Define the Types (`domains/billing/types.ts`):**

Create a `types.ts` file and define the public-facing types for the new domain.

**3. Create the SDK Methods (`domains/billing/index.ts`):**

Create an `index.ts` file and define the SDK methods. Use the `handleRequest` utility for all calls and apply the correct query/mutation pattern.

```ts
// Example Query
const queryInvoices = async (): Promise<InvoicesResponse> => {
  const response = await handleRequest(() => apiClient.get("/billing/invoices"));
  if (response.error) throw new ApiError(response.error);
  return response.data;
};

// Example Mutation
const createInvoice = async (data): Promise<ApiResponse<Invoice>> => {
  return handleRequest(() => apiClient.post("/billing/invoices", data));
};
```
**4. Add the Domain to the Main API (`src/api/index.ts`)**
**5. Re-export the Types (`src/api/types.ts`)**
**6. Add Mock Handlers**
