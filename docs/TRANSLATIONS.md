# Guide to Translatable API Messages

This document explains the contract for how the backend and frontend work together to display user-friendly, translatable messages for API responses, especially errors.

## 0. Important: Interpolation Syntax for i18next

**i18next requires double curly braces for variable interpolation in translation strings.**

- Use `{{variable}}` in your translation JSON, not `{variable}`.
- If you use single curly braces, interpolation will NOT work and the variable will not be replaced.

**Example:**

```json
// Correct
"newAccount": {
  "description": "You are signing up for the {{plan}} plan."
}

// Incorrect
"newAccount": {
  "description": "You are signing up for the {plan} plan."
}
```

**Why?**

- i18next only recognizes double curly braces for interpolation. See: https://www.i18next.com/translation-function/interpolation.html

---

## 1. The Backend-Frontend Translation Contract

The core principle is a clear separation of concerns:

-   **The Backend** is responsible for identifying the result of an operation (e.g., `INVALID_CREDENTIALS`, `USER_CREATED_SUCCESSFULLY`). It communicates this result by sending a predefined **i18n key** (a string code) in the API response.
-   **The Frontend** is responsible for the presentation. It takes this i18n key from the API response and uses the `i18next` library to look up the corresponding human-readable, translated string to display to the user.

This approach decouples backend logic from frontend display text, allowing UI messages to be changed and translated without requiring any backend code changes.

### Examples of Translatable Codes

The backend will provide a code for various scenarios:

-   **Authentication Errors**: `error.auth.invalid_credentials`, `error.auth.unauthorized`
-   **Validation Errors**: `error.validation.password_too_short`, `error.validation.email_invalid`
-   **Server/Business Logic Errors**: `error.general.not_found`, `error.general.internal_server_error`
-   **Success Messages**: `response.auth.login_success`, `response.general.operation_success`

All of these codes are defined centrally in `src/api/codes.ts` as part of the standardized response structure. For more context, see the **[API Response & Error Handling Guide](./ERROR_HANDLING.md)**.

---

## 2. How to Implement the Translation Flow

This section provides the practical steps for adding a new translatable message that originates from the backend.

### Step 1: Define the Code and Translation Key

First, define the new code in `src/api/codes.ts`. The `message` property must be the exact i18n key you will use.

```typescript
// src/api/codes.ts
export const ERROR_CODES = {
  // ... existing codes
  PASSWORD_TOO_WEAK: { status: 400, message: 'error.validation.password_too_weak' },
} as const;
```

### Step 2: Add the Translation Text

Next, add the key and its corresponding user-friendly text to the translation files.

```json
// src/locales/en/translation.json
"error": {
  "validation": {
    "password_too_weak": "Password is not secure enough. Please choose a stronger password."
  }
}
```

**If you need to interpolate a variable, use double curly braces:**

```json
"signup": {
  "alerts": {
    "newAccount": {
      "description": "You are signing up for the {{plan}} plan."
    }
  }
}
```

### Step 3: Use the Code in the Mock API

Ensure your mock API handler in `src/api/mocks/handlers/` uses the new code when appropriate.

```typescript
// In a mock handler for user registration
if (password.length < 8) {
  return HttpResponse.json(createErrorResponse('PASSWORD_TOO_WEAK'));
}
```

### Step 4: Translate the Code in the UI

Finally, in your UI component, the error message received from the API call will be the i18n key (`error.validation.password_too_weak`). Pass this key to the `t()` function to display the final message.

```jsx
// In a React component
const { t } = useTranslation();

const handleSubmit = async (data) => {
  try {
    await registerUser(data);
  } catch (error) {
    // error.message is the i18n key from the backend
    setApiError(t(error.message));
  }
};
```

By following this workflow, we ensure all API-driven messages are managed consistently and are fully translatable.
