# Application Architecture Guide

This document outlines the architectural decisions behind the PenguinMails dashboard, focusing on its hybrid structure, routing, theming, and state management.

---

## 1. Core Concept: A Hybrid Multi-Page & Single-Page App

Instead of a traditional Single-Page Application (SPA), this project uses a hybrid approach:

-   **Public Pages are Multi-Page:** Pages like `/login`, `/signup`, and the landing page are treated as separate, standalone pages.
-   **The Authenticated App is a Single-Page App:** Once a user is authenticated, the application operates as a traditional SPA, using React Router to handle all internal navigation (e.g., `/dashboard`, `/admin-panel`) without full page reloads.

### Why this approach?

1.  **Clean Separation of Concerns:** Public-facing pages have different requirements than a complex, data-driven dashboard. This architecture keeps their logic, dependencies, and styling separate.
2.  **Optimized Initial Load:** Users visiting public pages don't download the entire dashboard's JavaScript bundle, leading to faster initial loads.
3.  **Simplified State Management:** We avoid the complexity of managing a global state that handles both authenticated and unauthenticated views simultaneously.
4.  **Robust Authentication Flow:** It creates a clear wall between public and protected areas. An unauthenticated user cannot reach a protected route without a full page navigation to load the authenticated app's code.

---

## 2. Routing & Navigation (`react-router-dom` v6)

Routing is organized around a modular, feature-based structure, with a clear distinction between navigating within the SPA and crossing the boundary into it.

### Navigation: The Golden Rule

> **Are you navigating *inside* the authenticated SPA, or are you crossing the boundary from a public page to the SPA?**

-   **Inside the SPA:** For navigation between authenticated routes (e.g., `/dashboard` to `/admin-panel/users`), always use React Router's tools like the `<Link>` component or the `useNavigate` hook for fast, client-side navigation.
-   **Crossing the Boundary:** To move from a public page to the authenticated app (e.g., after login), use a standard `window.location.href` redirect. This forces the necessary full-page load.

### Key Routing Concepts

-   **Feature-Based Routes**: Routes are co-located with the features they belong to (e.g., `src/features/dashboard`, `src/features/admin-panel`). The main authenticated route configuration is in `src/features/dashboard/routes.tsx`.
-   **Layout Routes**: The application uses layout components to provide a consistent UI shell. A parent `<Route>` renders a layout, and an `<Outlet />` within that layout renders the active child route.
    -   `DashboardLayout.tsx`: The shell for the entire authenticated app, containing the shared header and sidebar.
    -   `PublicLayout.tsx`: The wrapper for all public-facing pages.
-   **Protected Routes**: The `ProtectedRoute` component (`src/components/ProtectedRoute.tsx`) wraps routes that require authentication, redirecting to the login page if the user is not authenticated. It can also check for specific user roles (e.g., `admin`).

---

## 3. Theming (`@radix-ui/themes`)

Theming is centralized to ensure a consistent look and feel across different parts of the application.

-   **Authenticated App Theme**: The theme for the authenticated app is controlled by a `<Theme>` provider in `src/features/dashboard/pages/App.tsx`. It can dynamically adjust its appearance based on user settings from `AppContext`.
-   **Public Pages Theme**: The theme for all public pages is controlled by a static `<Theme>` provider in `src/layouts/PublicLayout.tsx`.

---

## 4. State Management (React Context)

The application uses React's Context API for global state management.

### Authentication Flow (`AuthContext`)

1.  **Login:** On the `/login` page, `AuthContext`'s `login` function calls the API. On success, it stores the returned JWT in `localStorage` and redirects the browser to `/dashboard`.
2.  **Session Persistence:** When the authenticated app loads, `AuthProvider` checks `localStorage` for a valid token, verifies it with the backend, and populates the user state.
3.  **API Requests:** An `axios` interceptor automatically attaches the `Authorization: Bearer <token>` header to every outgoing API request.
4.  **Logout:** The `logout` function clears the user state, removes the token from `localStorage`, and redirects to `/login`.

### Application State (`AppContext`)

-   This context manages application-level state and settings that are not directly related to authentication, such as the color theme, language, and other user preferences.

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

---

## 5. Developer's Quick Reference: Key File Locations

This section provides a map to the locations of critical files and logic, helping you quickly find what you need.

- **Authentication**:
  - **Hook**: `src/hooks/useAuth.tsx` (Provides `user`, `login`, `logout`).
  - **Context & Provider**: `src/contexts/AuthContext/` (The core logic for session management).
  - **User Type Definition**: `src/types/index.ts` (Exports the global `User` type).

- **Routing**:
  - **Main Router Configuration**: `src/features/dashboard/routes.tsx` (Defines all authenticated routes).
  - **Dashboard Layout**: `src/layouts/DashboardLayout.tsx` (The main shell for the authenticated app).

- **Client-Side Caching**:
  - **Primary Hook**: `src/hooks/useAsyncCache.ts` (The main tool for cached data fetching).
  - **Context & Provider**: `src/contexts/CacheContext/` (Manages the IndexedDB instance).
  - **Management UI**: `src/components/CacheAdminPanel.tsx` (The UI for debugging the cache, visible on the profile page).

- **Global State & Types**:
  - **Shared Types**: `src/types/` (Central directory for all shared TypeScript interfaces).
  - **Vite Path Aliases**: `vite.config.ts` and `tsconfig.app.json` (Configuration for module shortcuts like `@components`).
