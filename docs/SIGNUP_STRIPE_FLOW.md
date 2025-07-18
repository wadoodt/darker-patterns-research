# Signup & Stripe Onboarding Flow: Technical Plan

## Overview

This document details the implementation plan for a user signup and Stripe onboarding flow in the `penguinmails-dashboard` codebase. The flow covers navigation from landing to pricing, signup, Stripe onboarding, and post-signup success, with all necessary type and API considerations.

---

## 1. Page Flow & Navigation

### 1.1. Landing Page (`/landing.html` or `/landing`)
- Entry point for users.
- Contains a button/link to the Pricing page (`/pricing.html` or `/pricing`).

### 1.2. Pricing Page (`/pricing.html` or `/pricing`)
- Lists available plans (e.g., Basic, Pro, Premium).
- Each plan has a “Sign Up” button.
- Clicking a plan navigates to `/signup.html?plan=pro` (or `basic`, `premium`).
- **Note:** Navigation is via `<a href="...">` (full page reload), not SPA routing, as these are static pages.

### 1.3. Signup Page (`/signup.html` or `/signup`)
- Reads the `plan` query parameter from the URL.
- If present, pre-selects the plan in a `<select>` dropdown.
- If not present, user must select a plan before submitting.
- User fills out the signup form (e.g., email, password, plan).
- On submit:
  - Calls backend API to create a user with status `created` and the selected plan.
  - Backend returns a Stripe onboarding/checkout URL.
  - **Current (Mock) Flow:**
    - Calls a mock `/api/payments` endpoint and immediately redirects to `/success`.
    - **TODO:** When Stripe is ready, replace this with a redirect to the real Stripe URL (`window.location.href = stripeUrl`).

### 1.4. Stripe Onboarding
- User completes payment/account creation in Stripe’s UI.
- Stripe is configured to redirect the user to `/success.html` (or `/signup/success`) after completion.
- **TODO:** When Stripe is ready, ensure the success page can handle Stripe's redirect/callback and display appropriate messages.

### 1.5. Success Page (`/success.html` or `/signup/success`)
- Static page.
- Informs the user that signup was successful and they should now log in or go to the dashboard.
- **New Behavior:**
  - Shows a 10-second countdown and auto-redirects to the dashboard (`/dashboard`).
  - Provides a button for immediate navigation to the dashboard.
  - The countdown timer is cleared if the user clicks the button.
- **TIP:** If Stripe's flow changes (e.g., Stripe redirects directly to the dashboard or another page), update the countdown/redirect logic accordingly.

### 1.6. Login & Dashboard
- User logs in via `/login.html` or `/login`.
- On dashboard load, the frontend checks the user’s status via API.
- If the user’s status is not `active`, display a message or restrict access.

---

## 2. TypeScript Types

### 2.1. User Creation Type
- Used for the signup form and API request to create a user.
- Should **not** include fields like `id`, `status`, or Stripe-related fields.
- Use TypeScript’s `Omit` utility to derive this from the main `User` type, or define a separate type.

```ts
// src/types/api/index.ts

export type User = {
  id: string;
  email: string;
  username: string;
  plan: 'basic' | 'pro' | 'premium';
  status: 'created' | 'active' | 'inactive';
  stripeCustomerId?: string;
  // ...other fields
};

export type CreateUserPayload = Omit<User, 'id' | 'status' | 'stripeCustomerId'> & {
  password: string;
};
```

### 2.2. Created User Type
- The existing `User` type (as above) is used for users returned from the API after creation.

---

## 3. API Endpoints

### 3.1. Create User
- **Endpoint:** `POST /api/users`
- **Payload:** `CreateUserPayload`
- **Response:** `{ user: User, stripeUrl: string }`
- The backend creates the user with status `created`, attaches a Stripe customer, and returns a Stripe onboarding URL.

### 3.2. Stripe Webhook
- Listens for Stripe events (e.g., `customer.created`, `checkout.session.completed`).
- On relevant event, updates the user’s status to `active`.

### 3.3. User Status Check
- **Endpoint:** `GET /api/users/me`
- Returns the current user, including their status.

---

## 4. Frontend Implementation Details

### 4.1. Static Pages & Navigation
- All navigation between `/landing`, `/pricing`, `/signup`, `/success`, and `/login` is via `<a href="...">` or `window.location.href = ...`.
- No SPA routing between these pages.

### 4.2. Signup Page Logic
- On load, parse the `plan` query parameter.
- If present, pre-select the plan in the form.
- If not, require the user to select a plan.
- On form submit:
  - Validate all fields.
  - POST to `/api/users` with the form data.
  - On success, POST to `/api/payments` (mock) and redirect to `/success`.
  - **TODO:** When Stripe is ready, redirect to the returned Stripe URL instead of `/success`.

### 4.3. Success Page
- Simple static page.
- **New:** Shows a 10-second countdown and auto-redirects to the dashboard, with a button for immediate navigation.
- **TODO:** If Stripe is integrated, ensure the success page can handle Stripe's redirect/callback and display appropriate messages.

### 4.4. Dashboard Page
- On mount, fetch the current user.
- If `user.status !== 'active'`, show a warning or restrict access.

---

## 5. Backend Considerations

- When creating a user, set `status: 'created'`.
- Attach a Stripe customer and generate a Stripe onboarding/checkout URL.
- On Stripe webhook event, update the user’s status to `active`.
- Ensure the Stripe redirect URL is set to `/success.html` (or `/signup/success`).
- **TODO:** When Stripe is ready, update the frontend to use the real Stripe URL and handle Stripe's redirect/callback on the success page.

---

## 6. Summary of Required Changes

- **New static page:** `/success.html` (or `/signup/success`) with countdown and dashboard redirect.
- **Update:** `/pricing.html` to add plan selection links with query params.
- **Update:** `/signup.html` to handle plan pre-selection and Stripe/mock payment redirect.
- **Types:** Add `CreateUserPayload` type using `Omit`.
- **API:** Ensure `/api/users` and `/api/payments` support the described flow.
- **Dashboard:** Add user status check on load.
- **TODO:** When Stripe is ready, update the signup and success flow as described above.

---

## 7. Example User Flow

1. User visits `/landing.html` → clicks “See Pricing” → `/pricing.html`
2. User clicks “Sign Up” on Pro plan → `/signup.html?plan=pro`
3. User fills out form, plan is pre-selected → submits
4. Backend creates user, returns Stripe URL (mocked for now) → frontend POSTs to `/api/payments` and redirects to `/success`
5. **Success page:** Shows a 10-second countdown and button to dashboard, then auto-redirects
6. User lands on dashboard
7. If status is `active`, user can use the app; otherwise, show warning

---

## 8. Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md): General project structure and design.
- [ENDPOINT_INTEGRATION.md](./ENDPOINT_INTEGRATION.md): API endpoint conventions and integration details.
- [ERROR_HANDLING.md](./ERROR_HANDLING.md): Error handling strategies for API and frontend.
- [CACHED_REQUEST.md](./CACHED_REQUEST.md): Client-side caching (relevant for dashboard data fetching).
- [mock-api-architecture.md](./mock-api-architecture.md): Mock API setup, useful for local development/testing.
- [TRANSLATIONS.md](./TRANSLATIONS.md): Internationalization, if needed for signup/success pages.

---

**This document serves as the blueprint for implementing the described signup and Stripe onboarding flow in your codebase.** 