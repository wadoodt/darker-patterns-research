# Styling Guide

This guide explains how to style components in the PenguinMails Dashboard using Radix UI, Radix Themes, and our approach to custom CSS and CSS modules for maintainable, accessible, and consistent UI.

---

## 1. **General Principles**

- **Consistency:** Use shared components and centralized theme config whenever possible.
- **Accessibility:** Always add ARIA attributes, keyboard navigation, and proper focus management.
- **Maintainability:** Prefer composable, reusable components and avoid inline styles except for quick layout tweaks.
- **Responsiveness:** Use CSS modules or global CSS for layouts and spacing.
- **File Organization:** Whenever possible, keep style files (CSS or CSS modules) next to the component or view they style. Only place global or page-level styles in `src/styles/`. Do not populate `src/styles/` with styles for lower-level components.

---

## 2. **Radix UI & Radix Themes**

- Use Radix UI components for all interactive elements (buttons, selects, dialogs, etc.) for accessibility and design consistency.
- Use the `<Theme>` provider (from `@radix-ui/themes`) to control appearance, accent color, and other theme props. The theme config is centralized in `src/styles/themes.ts`.
- Override Radix component props (e.g., `color`, `radius`, `highContrast`) as needed for your use case.
- For custom styles, use CSS classes or CSS modules and apply them via the `className` prop on Radix components.

---

## 3. **Custom CSS & CSS Modules**

- When Radix UI or Radix Themes do not support a required style, use custom CSS or CSS modules.
- Place global CSS in `src/styles/` and component-specific CSS in the same directory as the component or in a `components/` subfolder if shared by several components.
- For theme-based custom styling, create CSS classes for each theme variant (e.g., `.my-component-light`, `.my-component-dark`).
- Dynamically select the appropriate class based on the current theme from settings. See the example below for how to apply theme-based classes.
- Avoid writing inline styles except for quick layout fixes; prefer CSS classes or Radix props.

---

## 4. **Theme-based Styling Example**

Suppose you have a component that needs different styles for light and dark themes:

```css
/* src/components/MyComponent.css */
.my-component-light {
  background: #fff;
  color: #222;
}
.my-component-dark {
  background: #222;
  color: #fff;
}
```

```tsx
// src/components/MyComponent.tsx
import React from "react";
import { useApp } from "@hooks/useApp";
import "./MyComponent.css";

const MyComponent: React.FC = () => {
  const { settings } = useApp();
  const themeClass = settings.theme === "dark" ? "my-component-dark" : "my-component-light";

  return (
    <div className={themeClass}>
      {/* ...component content... */}
    </div>
  );
};

export default MyComponent;
```

---

## 5. **Accessibility Requirements**

- All interactive elements must be keyboard accessible (tabindex, onKeyDown, etc.).
- Use `aria-label` and other ARIA attributes for screen readers.
- Ensure sufficient color contrast (Radix high-contrast themes are available).
- Test with screen readers and keyboard navigation.

---

## 6. **Best Practices**

- Use descriptive variable and function names.
- Use early returns in event handlers for clarity.
- Keep components small and focused.
- Avoid inline styles except for quick layout fixes; prefer Radix props or CSS classes.
- Use centralized theme config for all theming (see `src/styles/themes.ts`).
- Document any custom CSS or overrides.

---

## 7. **Examples**

### Radix Button with Custom Class

```tsx
import { Button } from "@radix-ui/themes";
import "@styles/components/Button.css";

<Button className="my-button-class" color="blue" radius="large">
  Submit
</Button>;
```

### Accessible Custom Button

```tsx
<button
  className="my-custom-button"
  tabIndex={0}
  aria-label="Submit form"
  onClick={handleClick}
  onKeyDown={handleKeyDown}
>
  Submit
</button>
```

---

## 8. **Where to Learn More**

- [Radix UI Themes Docs](https://radix-ui.com/themes/docs/components/theme)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
