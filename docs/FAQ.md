# FAQ & Common Problems

This document covers common issues and their solutions that may arise during development.

---

## **Problem:** Nested routes (e.g., `/dashboard/settings`) don't render, or the UI doesn't update correctly.

### Symptoms:

-   You click a `<Link>` to a nested route like `/dashboard/settings` or `/admin-panel/users`.
-   The URL in the browser's address bar changes, but the page content does not update to the new component.
-   A shared UI layout (like a sidebar or header) disappears when navigating to certain sections of the app.

### Root Cause & Solution:

This issue almost always stems from one of two problems in your `react-router-dom` v6 setup:

**1. The Parent Layout is Missing an `<Outlet />` Component:**

The most common cause is that the parent component responsible for the layout (e.g., `DashboardLayout.tsx`) is missing the `<Outlet />` component. The `<Outlet />` acts as a placeholder, telling React Router exactly where to render the content of its child routes.

**Solution:** Ensure that your layout component includes `<Outlet />` where you want the child route's content to appear.

*Example (`DashboardLayout.tsx`):*
```tsx
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        {/* The Outlet component renders the active child route here */}
        <Outlet />
      </main>
    </div>
  );
}
```

**2. Incorrect Route Nesting Structure:**

If a shared layout disappears on certain routes, it means those routes are not correctly nested under the single, shared layout route.

**Solution:** All routes that should share a layout must be defined as children of a single parent `<Route>` that renders the layout component.

*Example (`routes.tsx`):*

**Incorrect Structure (Admin panel won't have the layout):**
```tsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardPage />} />
  </Route>
  <Route path="/admin-panel" element={<AdminPage />} />
</Routes>
```

**Correct Structure (Both share the layout):**
```tsx
<Routes>
  {/* A single parent route renders the layout for all its children */}
  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/admin-panel" element={<AdminPage />} />
  </Route>
</Routes>
```
