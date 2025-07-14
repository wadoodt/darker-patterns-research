# Application Architecture Guide

This document outlines the architectural decisions behind the client dashboard, focusing on authentication, navigation, and the multi-page application (MPA) structure. Understanding these concepts is key to maintaining and extending the application correctly.

---

## 1. Core Concept: A Hybrid Multi-Page & Single-Page App

Instead of a traditional Single-Page Application (SPA), this project uses a hybrid approach:

-   **Public Pages are Multi-Page:** Pages like `/login`, `/signup`, and the landing page are treated as separate, standalone pages. Each has its own HTML entry point (e.g., `login.html`) and TypeScript/React entry point (e.g., `login.tsx`).
-   **The Dashboard is a Single-Page App:** Once a user is authenticated, the `/dashboard` section operates as a traditional SPA, using React Router to handle all internal navigation without full page reloads.

### Problems Solved by this Approach

1.  **Clean Separation of Concerns:** Public-facing marketing or auth pages have very different requirements than a complex, data-driven dashboard. This architecture keeps their logic, dependencies, and styling completely separate.
2.  **Optimized Initial Load:** Users who only visit the landing page don't have to download the entire dashboard's JavaScript bundle, leading to faster initial page loads.
3.  **Simplified State Management:** We avoid the complexity of managing a global application state that needs to handle both authenticated and unauthenticated views simultaneously. The state for public pages is minimal, and the dashboard's state is self-contained.
4.  **Robust Authentication Flow:** It creates a clear, unbreachable wall between public and protected areas. An unauthenticated user can never accidentally reach a dashboard route, as it requires a full page navigation to even load the dashboard's code.

---

## 2. Authentication Flow

Authentication is managed via `AuthContext` and a JWT (JSON Web Token) flow, supported by a mock API.

1.  **Login:** The user submits credentials on the `/login` page. The `AuthContext`'s `login` function calls the API, and on success, it stores the returned token and its expiration time in `localStorage`.
2.  **Session Persistence:** When the application first loads, the `AuthProvider`'s `useEffect` hook runs:
    -   It checks `localStorage` for a valid, unexpired token.
    -   If a token exists, it makes a call to `/api/auth/me` to verify the token with the backend and fetch the current user's data.
    -   If the `/me` call is successful, the user state is populated, and the session is considered active.
3.  **API Requests:** An `axios` interceptor (`src/api/client.ts`) automatically attaches the `Authorization: Bearer <token>` header to every outgoing API request, ensuring all communication with the backend is authenticated.
4.  **Logout:** The `logout` function clears the user state from `AuthContext`, removes the token from `localStorage`, and forces a full page redirect to `/login`.

---

## 3. Navigation: The Golden Rule

Correct navigation is critical in this hybrid model. The rule is simple:

> **Are you navigating *inside* the Dashboard SPA, or are you crossing the boundary between the public site and the Dashboard?**

### A. Navigating INSIDE the Dashboard SPA

For any navigation between routes that are part of the dashboard (e.g., from `/dashboard/settings` to `/dashboard/profile`), always use React Router's tools.

**Use:**
-   The `<Link>` component: `<Link to="/dashboard/profile">Profile</Link>`
-   The `useNavigate` hook: `navigate('/dashboard/profile')`

This provides fast, client-side navigation without a full page reload.

### B. Navigating BETWEEN Public Pages or Crossing into the Dashboard

For any navigation that crosses the boundary between a public page and the dashboard (in either direction), you **must** trigger a full page reload.

**Use:**
-   A standard HTML anchor tag: `<a href="/login">Log In</a>`
-   `window.location.href`: `window.location.href = '/dashboard';`

**Examples:**
-   A link from the landing page to the login page: `<a href="/login">...</a>`
-   Redirecting from the login page to the dashboard after success: `window.location.href = '/dashboard';`
-   The "Logout" button in the dashboard redirecting to login: `<a href="/login" onClick={logout}>...</a>`

---

## 4. Layouts and Protected Routes

-   **`PublicLayout` & `DashboardLayout`:** These components provide the structural shell for their respective sections. `DashboardLayout` contains the `Outlet` from React Router to render the active SPA route, while `PublicLayout` is a simpler wrapper for the multi-page content.

-   **`ProtectedRoute`:** This component is the gatekeeper for the dashboard. Its logic is specifically designed for our hybrid model:
    -   It checks the `AuthContext` for an authenticated user.
    -   If the user is **not** authenticated, it does **not** use React Router's `<Navigate>`. Instead, it forces a hard redirect using `window.location.href = '/login'`. This is crucial because it unloads the entire dashboard application and sends the user back to the completely separate login page, ensuring no protected code or data is ever exposed.
