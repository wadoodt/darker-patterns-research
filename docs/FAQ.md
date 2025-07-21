# FAQ & Common Problems

This document covers common issues and their solutions that may arise during development.

---

## **New: How do I style public pages and use the new theming system?**

**Q: How is theming handled for public pages?**

- All public pages (landing, login, signup, recover-password, success, etc.) are wrapped in `PublicLayout`, which now includes `AppProvider` and a dynamic Radix UI `<Theme>` provider.
- The theme is selected based on user/app settings and is configured centrally in `src/styles/themes.ts`.
- You can switch themes using the `ThemeSwitcher` component, and all public pages will update accordingly.

**Q: Where do I configure or add new themes?**

- Edit `src/styles/themes.ts` to add or adjust theme options. This is the single source of truth for public page themes.

**Q: Where can I find best practices for styling (CSS, Radix UI, Tailwind)?**

- See the new `docs/STYLING_GUIDE.md` for up-to-date recommendations and code standards for styling components, using Radix UI, and integrating TailwindCSS.

---

## **Problem:** i18next interpolation does not work (variable is not replaced)

### Symptoms:

- You see `{plan}` or another variable name in your UI instead of the expected value (e.g., "You are signing up for the {plan} plan.").
- The variable is not replaced with the actual value.

### Root Cause & Solution:

- **Root Cause:** i18next requires double curly braces for interpolation in translation files. If you use single curly braces (e.g., `{plan}`), interpolation will not work.

**Solution:**

- Always use double curly braces for variables in your translation JSON: `{{plan}}`.

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

**How to avoid this in the future:**

- When adding any variable to a translation string, always use double curly braces: `{{variable}}`.
- Review the [i18next interpolation documentation](https://www.i18next.com/translation-function/interpolation.html) for more details.
- If you see a variable not being replaced, check your translation file for this mistake first.

---

## **Problem:** Nested routes (e.g., `/dashboard/settings`) don't render, or the UI doesn't update correctly.

### Symptoms:

- You click a `<Link>` to a nested route like `/dashboard/settings` or `/admin-panel/users`.
- The URL in the browser's address bar changes, but the page content does not update to the new component.
- A shared UI layout (like a sidebar or header) disappears when navigating to certain sections of the app.

### Root Cause & Solution:

This issue almost always stems from one of two problems in your `react-router-dom` v6 setup:

**1. The Parent Layout is Missing an `<Outlet />` Component:**

The most common cause is that the parent component responsible for the layout (e.g., `DashboardLayout.tsx`) is missing the `<Outlet />` component. The `<Outlet />` acts as a placeholder, telling React Router exactly where to render the content of its child routes.

**Solution:** Ensure that your layout component includes `<Outlet />` where you want the child route's content to appear.

_Example (`DashboardLayout.tsx`):_

```tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Assuming a Sidebar component exists

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="content">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}
```

**2. Incorrect Route Configuration:**

The routes are not nested correctly in your router configuration. For child routes to render inside a parent layout, they must be defined as `children` of the parent route in your `createBrowserRouter` or `<Routes>` setup.

_Incorrect Configuration (Sibling Routes):_

```tsx
// Routes are defined as siblings, so DashboardLayout will not wrap the settings page.
createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardLayout />,
  },
  {
    path: "/dashboard/settings",
    element: <SettingsPage />,
  },
]);
```

_Correct Configuration (Nested Routes):_

```tsx
// The settings route is a child of the dashboard route.
// SettingsPage will now render inside DashboardLayout's <Outlet />.
createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "settings", // Note: no leading slash, as it's relative to the parent
        element: <SettingsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
```

**2. Incorrect Route Nesting Structure:**

If a shared layout disappears on certain routes, it means those routes are not correctly nested under the single, shared layout route.

**Solution:** All routes that should share a layout must be defined as children of a single parent `<Route>` that renders the layout component.

_Example (`routes.tsx`):_

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

---

## **Problem:** TypeScript build fails with module-not-found errors.

### Symptoms:

- You get errors like `error TS2307: Cannot find module 'types' or its corresponding type declarations.`
- The error often points to an import statement that uses a path alias, like `import type { User } from 'types';`.

### Root Cause & Solution:

This happens when the TypeScript compiler doesn't know how to resolve a path alias to a physical path on disk. The solution is to define the alias in the `paths` object of your `tsconfig.json` file (or `tsconfig.app.json` and `tsconfig.node.json` in this project).

**Solution:** Add an entry to the `paths` configuration that maps the alias to the correct directory.

_Example (`tsconfig.app.json`):_

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"], // This allows `@components/Button`
      "types": ["types"], // This allows `import from 'types'`
      "types/*": ["types/*"] // This allows `import from 'types/api'`
    }
  }
}
```

**Important:** This project uses separate `tsconfig.app.json` (for the React app) and `tsconfig.node.json` (for Vite/mock server config). You must apply this fix to **both** files to ensure paths are resolved consistently everywhere.

---

## **Problem:** TypeScript throws type errors on request/response objects or environment variables.

### Symptoms:

- `Property 'role' does not exist on type 'unknown'` after getting a request body with `await request.json()`.
- `Property 'env' does not exist on type 'ImportMeta'` when accessing `import.meta.env.VITE_...`.
- `Property 'entries' does not exist on type 'Headers'` when trying to iterate over response headers.

### Root Cause & Solution:

These errors occur when TypeScript doesn't have the correct type information for an object. This can be due to a missing type cast, an incomplete `tsconfig.json` `lib` configuration, or missing type definitions for a specific library (like Vite).

**Solutions:**

**1. Type Cast Request Bodies:**
When you get a request body from `request.json()`, it has the type `unknown`. You must cast it to the expected type.

_Example (`admin-handler.ts`):_

```ts
import type { User } from "types/api";

// Cast the JSON body to a partial User type
const { role, status } = (await request.json()) as Partial<
  Pick<User, "role" | "status">
>;
```

**2. Add Vite Client Types:**
For errors related to `import.meta.env`, ensure Vite's client types are loaded. The most reliable way is to add a triple-slash directive to the top of the file that needs it.

_Example (`api/client.ts`):_

```ts
/// <reference types="vite/client" />

import axios from "axios";
// ... rest of the file
```

**3. Handle Headers Object Correctly:**
The `Headers` object is not a plain JavaScript object. If you need to convert it to one, use its `forEach` method to build the object manually. This is more robust than relying on specific `lib` versions.

_Example (`api/client.ts`):_

```

---

## **Problem:** TypeScript/ESLint errors for `[key: string]: any` in interfaces (mock DB compatibility)

### Symptoms:
- You see errors like `Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any` in interfaces with `[key: string]: any;`.
- Lint or build fails in files like `types/support-ticket.ts`.

### Solution:
- Replace `any` with `unknown` in the index signature:

```ts
// Instead of:
export interface SupportTicket {
  [key: string]: any;
  // ...fields
}

// Use:
export interface SupportTicket {
  [key: string]: unknown;
  // ...fields
}
```

- This satisfies the linter and works for most mock DB/dev cases. If you need to access a dynamic property, cast it as needed:

```ts
const value = ticket[someKey] as string;
```

- **Avoid using `any` unless absolutely necessary.** If you must use it, add an inline eslint-disable comment, but note that some configs will auto-remove it:

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
[key: string]: any;
```

- For production code, avoid index signatures entirely unless you truly need dynamic keys.

---
