# Client Dashboard

This project is a client dashboard built with React, TypeScript, and Vite. It features a robust mock API for development and testing, a standardized error handling system, and a clear process for integrating new API endpoints.

## Project Documentation

For a complete understanding of the project's architecture, conventions, and workflows, please refer to the following documents:

- **[Mock API Architecture](./docs/mock-api-architecture.md)**: An in-depth look at the mock API's design and components.
- **[Endpoint Integration Guide](./docs/ENDPOINT_INTEGRATION.md)**: The step-by-step process for adding or updating API endpoints.
- **[API Response & Error Handling](./docs/ERROR_HANDLING.md)**: The guide to our standardized API response and error handling pattern.
- **[Translatable API Messages](./docs/TRANSLATIONS.md)**: How to work with internationalization (i18n) for API messages.
- **[Authentication System](./docs/API_LAYER.md#2-authentication--token-management)**: Complete JWT authentication with automatic token refresh.
- **[Client-Side Caching](./docs/CACHED_REQUEST.md)**: Robust caching system with authentication-aware features.

## Key Features

### 🔐 Authentication System
- **JWT-based authentication** with automatic token refresh
- **Functional TokenService** for centralized token management
- **Event-driven architecture** for token change notifications
- **Continuous validation** and proactive token refresh
- **Request queuing** to prevent duplicate refresh attempts

### 🗄️ Mock API
- **Full authentication flow** support in development
- **Stateful mock database** with realistic data
- **Token validation** and role-based access control
- **Seamless integration** with caching system

### 📦 Caching System
- **IndexedDB-based** persistent caching
- **Authentication-aware** TTL calculation
- **Automatic cache recovery** and resilience
- **Cache management panel** for debugging

### 🎨 Modern UI
- **React + TypeScript** for type safety
- **TailwindCSS** for styling
- **Radix UI** components for accessibility
- **Theme system** for public pages

## Quick Start

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Enable mock API** (optional):
   ```bash
   # Create .env.local file
   echo "VITE_USE_MOCKS=true" > .env.local
   ```

### Authentication Development

The project includes a complete authentication system that works seamlessly in both development and production:

```typescript
// Login example
import { useAuth } from "@hooks/useAuth";

function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (credentials) => {
    try {
      await login(credentials.username, credentials.password);
      // User is now authenticated
    } catch (error) {
      // Handle login error
    }
  };
}

// Protected component example
function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### API Development

The mock API supports the complete authentication flow:

```typescript
// Protected endpoint example
import { authorize } from "../utils/auth";

export const protectedEndpoint = async (request: Request) => {
  const user = await authorize(request, ["user", "admin"]);
  return new Response(JSON.stringify({ data: "protected data" }));
};
```

## Architecture Overview

### Authentication Flow
1. **Login** → Tokens stored via `TokenService`
2. **API Requests** → Automatic `Authorization` header injection
3. **Token Refresh** → Automatic on 401 errors with request queuing
4. **Token Validation** → Continuous validation with proactive refresh

### Mock Environment
- **Full authentication support** with token validation
- **Role-based access control** in mock handlers
- **Token rotation** and refresh token support
- **Seamless integration** with caching system

### Caching System
- **Authentication-aware** TTL calculation
- **Token-based** cache invalidation
- **Persistent storage** with IndexedDB
- **Automatic recovery** from database errors

## Contributing

When adding new features:

1. **Follow the API Layer patterns** for consistent data fetching
2. **Use TokenService** for all token operations
3. **Implement proper authentication** in mock handlers
4. **Add comprehensive tests** for authentication flows
5. **Update documentation** for any new patterns

## Troubleshooting

For common issues and solutions, see the **[FAQ](./docs/FAQ.md)** which includes:
- Authentication troubleshooting
- Token refresh issues
- Mock API problems
- Caching issues
- TypeScript errors

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
