# Contributing to PenguinMails Dashboard

First off, thank you for considering contributing to this project! Any contribution, whether it's a bug report, a new feature, or an improvement to the documentation, is greatly appreciated.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on our issue tracker. When you do, please include:

*   A clear and descriptive title.
*   A detailed description of the problem, including steps to reproduce it.
*   Information about your environment (e.g., browser, operating system).

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please open an issue to discuss it. This allows us to coordinate our efforts and make sure your contribution aligns with the project's goals.

### Submitting Pull Requests

1.  Fork the repository and create a new branch from `main`.
2.  Make your changes and ensure that the code lints and builds correctly.
3.  Write clear and concise commit messages.
4.  Open a pull request with a detailed description of your changes.

## Development Guidelines

### Code Style

We use Prettier and ESLint to maintain a consistent code style. Please make sure to run the linter before submitting a pull request.

### Forms and Modals

When creating forms within modals, be mindful of the default behavior of buttons. A common pitfall is forgetting to specify `type="button"` for non-submit buttons (like a "Cancel" button). Without this, the button will default to `type="submit"` and trigger a form submission, which can lead to unexpected behavior.

**Example:**

```tsx
// Correct
<Button type="button" onClick={handleCancel}>
  Cancel
</Button>

// Incorrect (will submit the form)
<Button onClick={handleCancel}>
  Cancel
</Button>
```
