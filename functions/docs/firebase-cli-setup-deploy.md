# Firebase CLI: Setup, Login, and Deployment Guide

This guide covers the essentials of setting up the Firebase Command Line Interface (CLI), logging in, and deploying different parts of your Firebase project, including Hosting and Functions (using the v2 syntax).

## 1. Installing the Firebase CLI

The Firebase CLI allows you to manage, view, and deploy your Firebase projects directly from the terminal.

**Prerequisites:**

- Node.js (version 18.0.0 or later is **required** for Firebase Functions v2 and is highly recommended). You can download it from [nodejs.org](https://nodejs.org/).
- npm (Node Package Manager), which is included with Node.js.

**Installation:**

Open your terminal or command prompt and run the following command:

```bash
npm install -g firebase-tools
```

This installs the CLI globally on your system.

**Verify Installation:**

After installation, you can verify it by running:

```bash
firebase --version
```

This should display the installed version of the Firebase CLI. Make sure it's a recent version to support v2 functions.

## 2. Logging into Firebase

Once the CLI is installed, you need to log in with the Google account associated with your Firebase projects.

**Login Command:**

```bash
firebase login
```

This command will:

1.  Open a browser window.
2.  Prompt you to sign in with your Google account.
3.  Ask for permission to allow Firebase CLI to access your account.

After successful authentication, you'll see a success message in your terminal.

**Checking Login Status:**

You can check which account is currently logged in by running:

```bash
firebase login --S
```

or

```bash
firebase projects:list
```

This will list projects accessible by the logged-in account.

**Logging out:**

If you need to switch accounts or log out:

```bash
firebase logout
```

## 3. Initializing Your Firebase Project Locally

If you haven't already, you need to link your local project directory to a Firebase project. Navigate to your project's root directory in the terminal and run:

```bash
firebase init
```

Follow the prompts:

- **Which Firebase features do you want to set up?** Use the arrow keys and spacebar to select features like "Hosting," "Functions," "Firestore," etc. For this project, you'll typically select at least "Hosting" and "Functions."
- **Project Setup:**
  - Choose "Use an existing project" and select your Firebase project from the list.
  - Or, choose "Create a new project" if you haven't created one in the Firebase console.
- **Hosting:**
  - **Public directory?** For Next.js, this is typically `.next` or `out` (if using static export). For App Hosting, this is less relevant as it handles the build.
  - **Configure as a single-page app?** Usually "Yes" for modern web apps.
  - **Set up automatic builds and deploys with GitHub?** Choose "No" for manual deployment, or "Yes" to connect to your Git repository for automated deployments with App Hosting.
- **Functions:**
  - **Language?** Choose TypeScript.
  - **Use ESLint?** Yes.
  - **Install dependencies?** Yes.
- **Firestore:**
  - **Rules file name?** `firestore.rules` (default)
  - **Indexes file name?** `firestore.indexes.json` (default)

This creates `firebase.json` and `.firebaserc` configuration files in your project. It's crucial to inspect `firebase.json` after initialization, especially the `functions` section, to ensure it's configured correctly for v2 functions.

## 4. Deploying Your Project

### Deploying to Firebase Hosting (Visual Frontend)

If you are deploying a Next.js app to Firebase Hosting (for static assets):

1.  **Build your Next.js app:**

    ```bash
    npm run build
    ```

    This creates an `out` folder (if `output: 'export'` is in `next.config.js`) or a `.next` folder. Your `firebase.json` `hosting.public` setting should point to the correct build output directory.

2.  **Deploy to Hosting:**

    ```bash
    firebase deploy --only hosting
    ```

    Or, if you have multiple hosting sites configured:

    ```bash
    firebase deploy --only hosting:your-site-name
    ```

### Deploying to Firebase App Hosting (Recommended for Next.js)

Firebase App Hosting is designed for Next.js applications and handles the build and deployment process more seamlessly. It's the preferred method for dynamic Next.js apps.

1.  **Ensure `apphosting.yaml` is configured.** This file is crucial and defines your App Hosting backend. It's usually provided by Firebase Studio or generated during `firebase init apphosting`. Review it carefully.
2.  **Commit your changes to Git.** App Hosting typically builds from your Git repository.
3.  **Deploy using the App Hosting backend ID:**

    The deployment process for App Hosting is often automated through Git integration. Pushing to your connected Git branch triggers a build and deployment.

    For manual CLI-driven App Hosting deploys (less common with Firebase Studio), you might use:

    ```bash
    firebase apphosting:backends:update <backendId> --source .
    ```

    **Important:** Refer to the official Firebase App Hosting documentation for the _exact_ and most up-to-date CLI deployment commands. The commands can vary depending on your setup (Firebase Studio, Git integration, etc.). For Firebase Studio projects, deployments are often managed through the Studio interface or integrated Git workflows. The key is to understand your `apphosting.yaml` and how it connects to your Git repository (if applicable).

### Deploying Firebase Functions (v2)

Firebase Functions v2 offers significant improvements in performance and scalability. Here's how to deploy them:

1.  **Ensure your functions are written in the `functions/src` directory (typically in `index.ts` or `index.js`).** Make sure you're using the v2 syntax (importing from `firebase-functions/v2`). See the example at the beginning of this response.
2.  **From your project's root directory (or inside the `functions` directory):**

    ```bash
    firebase deploy --only functions
    ```

    To deploy a specific function:

    ```bash
    firebase deploy --only functions:yourFunctionName
    ```

    **Important:** With v2 functions, the `firebase.json` file needs to be correctly configured to point to your functions directory. Double-check this.

### Deploying Firestore Rules

1.  Ensure your rules are defined in `firestore.rules`.
2.  Deploy:

    ```bash
    firebase deploy --only firestore:rules
    ```

    You can also deploy indexes:

    ```bash
    firebase deploy --only firestore:indexes
    ```

    Or deploy both rules and indexes:

    ```bash
    firebase deploy --only firestore
    ```

### Deploying Everything Configured

To deploy all Firebase features that you've configured in `firebase.json` (Hosting, Functions, Firestore rules, etc.):

```bash
firebase deploy
```

## 5. FAQ & Common Issues

- **Q: I just changed my Firestore rules. How do I deploy only them?**

  A: `firebase deploy --only firestore:rules`

- **Q: How do I deploy only the visual frontend (Hosting)?**

  A: `firebase deploy --only hosting` (Ensure your Next.js app is built first if deploying to standard Firebase Hosting. For App Hosting, it's usually a Git push or a specific App Hosting command).

- **Q: My functions deployment failed. Where can I see logs?**

  A:

  1.  Check the terminal output for initial error messages.
  2.  Go to the Firebase console -> Functions -> Logs tab for detailed runtime logs of your functions. The logs are now organized differently in the console for v2 functions, so familiarize yourself with the new interface.
  3.  For build errors during deployment, the terminal output is usually the best source.

- **Q: I get a "Permission denied" error when deploying.**

  A:

  1.  Ensure you are logged in with the correct Firebase account: `firebase login`.
  2.  Verify that the logged-in account has the necessary IAM permissions (e.g., Owner, Editor, or Firebase Admin) on the Firebase project.
  3.  Check if there are any billing issues with your Firebase project.

- **Q: How do I switch between Firebase projects?**

  A: Use `firebase use <project_id_or_alias>`. You can see a list of your projects with `firebase projects:list`. You can set an alias using `firebase use --add`.

- **Q: My deployment is slow.**

  A:

  - For functions, ensure you're only deploying changed functions if possible.
  - For hosting, ensure your build output directory (`hosting.public`) doesn't contain unnecessary large files.
  - Check your internet connection.
  - V2 functions can sometimes have longer initial deployment times due to the underlying Cloud Run infrastructure.

- **Q: What's the difference between `firebase.json` and `.firebaserc`?**

  A:

  - `.firebaserc`: Primarily maps project aliases to Firebase project IDs. It tells the CLI which Firebase project your local directory is connected to.
  - `firebase.json`: Contains the configuration for various Firebase services (Hosting, Functions, Firestore rules path, etc.) for your project. **Crucially, it defines how the Firebase CLI interacts with your project.**

- **Q: I'm using Firebase App Hosting. How do I deploy?**

  A: **This is the most important change.** Firebase App Hosting deployments are _primarily_ managed through Git integration or the Firebase Studio interface. Manual CLI deployments are less common. Consult the official Firebase App Hosting documentation and your `apphosting.yaml` file for the specific commands and workflow for your project. The `firebase apphosting:backends:update` command is a _potential_ option, but it depends on your setup.

- **Q: How do I upgrade from v1 to v2 functions?**

  A: This is a more involved process. See the official Firebase documentation on migrating from v1 to v2 functions. Key steps include:

  1.  Updating your `firebase-functions` and `firebase-admin` dependencies.
  2.  Changing your import statements to use `firebase-functions/v2`.
  3.  Updating your function triggers to the v2 syntax.
  4.  Testing thoroughly.

Always refer to the [official Firebase CLI documentation](https://firebase.google.com/docs/cli) and the [Firebase Functions v2 documentation](https://firebase.google.com/docs/functions/2nd-gen-upgrade) for the most comprehensive and up-to-date information. Pay close attention to the App Hosting deployment process, as it's significantly different from traditional Firebase Hosting.
