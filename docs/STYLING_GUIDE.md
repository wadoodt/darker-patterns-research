# Styling Guide

This guide explains how to style components in the PenguinMails Dashboard using Radix UI, TailwindCSS, and best practices for maintainable, accessible, and consistent UI.

---

## 1. **General Principles**

- **Consistency:** Use shared components and centralized theme config whenever possible.
- **Accessibility:** Always add ARIA attributes, keyboard navigation, and proper focus management.
- **Maintainability:** Prefer composable, reusable components and avoid inline styles except for quick layout tweaks.
- **Responsiveness:** Use Tailwind's responsive utilities for layouts and spacing.

---

## 2. **Radix UI**

- Use Radix UI components for all interactive elements (buttons, selects, dialogs, etc.) for accessibility and design consistency.
- Use the `<Theme>` provider (from `@radix-ui/themes`) to control appearance, accent color, and other theme props. The theme config is centralized in `src/styles/themes.ts`.
- Override Radix component props (e.g., `color`, `radius`, `highContrast`) as needed for your use case.
- For custom styles, use Tailwind classes via the `className` prop on Radix components.

---

## 3. **TailwindCSS**

- Use Tailwind utility classes for layout, spacing, typography, and custom visual tweaks.
- Prefer Tailwind for:
  - Layout (flex, grid, spacing, width, height)
  - Typography (font size, weight, color)
  - Responsive design
  - Quick visual adjustments
- Use `class:` syntax for conditional classes when possible.
- Avoid writing custom CSS unless absolutely necessary. If you must, use `src/styles/` and document why.

---

## 4. **When to Use What**

- **Radix UI:** For all interactive and accessible UI primitives.
- **Tailwind:** For layout, spacing, and visual tweaks.
- **Custom CSS:** Only for project-wide overrides or when neither Radix nor Tailwind can achieve the result.

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
- Avoid inline styles except for quick layout fixes; prefer Tailwind or Radix props.
- Use centralized theme config for all theming (see `src/styles/themes.ts`).
- Document any custom CSS or overrides.

---

## 7. **Examples**

### Radix Button with Tailwind

```tsx
import { Button } from "@radix-ui/themes";

<Button className="w-full py-2" color="blue" radius="large">
  Submit
</Button>;
```

### Accessible Custom Button

```tsx
<button
  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
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
- [TailwindCSS Docs](https://tailwindcss.com/docs/utility-first)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
