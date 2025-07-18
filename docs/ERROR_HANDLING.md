# API Response and Error Handling Guide

This document outlines the standardized pattern for handling API responses and errors in this project. Following this guide is crucial for maintaining a consistent, predictable, and maintainable codebase.

## 1. The Standardized `ApiResponse` Pattern

All API endpoints **MUST** return a response that conforms to the `ApiResponse<T>` type defined in `src/types/api/index.ts`.

This single, consistent shape simplifies frontend logic by eliminating guesswork. Every response will have either a `data` object on success or an `error` object on failure, but never both.

- **Success Response**: Contains a `data` object with the payload and a `message` code.
- **Error Response**: Contains an `error` object with a translatable `message` key and optional `validations` for form errors.

### Core Files

- **`src/types/api/index.ts`**: Defines the core `ApiResponse`, `ApiSuccess`, and `ApiError` types.
- **`src/api/codes.ts`**: Contains the centralized `RESPONSE_CODES` and `ERROR_CODES` dictionaries. All user-facing messages are defined here as i18n keys. For a detailed explanation of this process, see the **[Translatable API Messages Guide](./TRANSLATIONS.md)**.
- **`src/api/response.ts`**: Provides the `createSuccessResponse()` and `createErrorResponse()` helper functions to ensure responses are built correctly.

---

## 2. What to Avoid

To maintain consistency, please avoid the following:

- **❌ Throwing Errors from API Handlers**: Do not use `throw new Error()` in your API handlers. Instead, return a standardized error response using `createErrorResponse()`.
- **❌ Inconsistent Response Shapes**: Never return a raw data object or a custom error shape. All responses must be wrapped in our `ApiResponse` structure.
- **❌ Hardcoded Strings**: Do not use raw strings for error or success messages. All messages must be defined as keys in `src/api/codes.ts` and translated using the i18n system.

---

## 3. How to Implement for a New Endpoint

Here is the step-by-step process for creating a new API endpoint that follows our standard.

### Step 1: Define New Response/Error Codes

Open `src/api/codes.ts` and add any new success or error codes your endpoint requires. The `message` property **must** be a valid key from the translation files in `src/locales/`.

```typescript
// src/api/codes.ts
export const ERROR_CODES = {
  // ... existing codes
  USER_NOT_FOUND: { status: 404, message: "error.user.not_found" },
} as const;
```

### Step 2: Add Translations

Open `src/locales/en/translation.json` and add the corresponding translation for your new key.

```json
// src/locales/en/translation.json
"error": {
  "user": {
    "not_found": "The requested user could not be found."
  }
}
```

### Step 3: Create the Mock API Handler

In `src/api/mocks/handlers/`, create or modify a handler for your endpoint. Use the helper functions to build the response.

```typescript
// src/api/mocks/handlers/users.ts
import { createSuccessResponse, createErrorResponse } from "../../response";

http.get("/api/users/:id", ({ params }) => {
  const user = db.users.findFirst({ where: { id: Number(params.id) } });

  if (!user) {
    return HttpResponse.json(createErrorResponse("USER_NOT_FOUND"));
  }

  return HttpResponse.json(createSuccessResponse(user, "OPERATION_SUCCESS"));
});
```

### Step 4: Implement the Frontend Logic

When calling the API from the frontend, type the response with `ApiResponse<YourType>` and check for the `error` property.

```typescript
// src/features/users/api.ts
import apiClient from "../../api/client";
import type { ApiResponse, User } from "../../types";

export const fetchUser = async (id: number): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);

  if (response.data.error) {
    // The error message is the i18n key, ready for translation.
    throw new Error(response.data.error.message);
  }

  // On success, response.data.data contains the user.
  return response.data.data;
};
```

### Step 5: Handle the Error in the UI

In your component, use a `try...catch` block. The error message you receive will be the i18n key, which you can pass to the `t()` function.

```jsx
// src/pages/UserProfilePage.tsx
const { t } = useTranslation();

try {
  const user = await fetchUser(123);
  // ... render user
} catch (error) {
  // error.message will be 'error.user.not_found'
  setErrorMessage(t(error.message));
}
```

By following these steps, you create a robust, type-safe, and maintainable API integration that is consistent across the entire application.
