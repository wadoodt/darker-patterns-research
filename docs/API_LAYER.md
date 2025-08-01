# API Layer Architecture Guide

This document outlines the architecture of the application's API layer. The goal is to provide a clean, consistent, and maintainable interface for all backend communication. It follows a "frontend SDK" pattern, abstracting away the complexities of HTTP requests and data caching, providing a type-safe, domain-driven API of React hooks.

---

## 1. Core Concepts

The API layer is divided into three main parts:

1.  **The API Functions (`src/api/domains/.../index.ts`):** Raw, async functions that perform the actual `apiClient` calls. These are the pure communication layer and should be considered an internal implementation detail. They use the `handleQuery` and `handleMutation` utilities to standardize error handling.
2.  **The API Hooks (`src/api/domains/.../hooks.ts`):** A set of custom React Query hooks that serve as the **public interface** for the API layer. The rest of the application should **only** interact with the API through these hooks.
3.  **The API Types (`src/api/domains/.../types.ts`):** TypeScript definitions for the data structures used by the domain.

---

## 2. Using the API SDK

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
