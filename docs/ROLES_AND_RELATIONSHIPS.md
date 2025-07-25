# User, Company, and Role Architecture

This document outlines the data models, relationships, and roles for the PenguinMails application. It serves as the single source of truth for this architecture.

## 1. Core Concepts & Definitions

- **User**: A global entity representing an individual who can log into the platform. Every person with an account is a `User`.
- **Company**: A distinct organizational entity. Each `Company` has its own set of team members, data, and settings.
- **Team Member / Membership**: A `User`'s association with a `Company`. This is not a separate entity but a link that defines a user's role *within* that specific company.

---

## 2. Role Definitions

We have two categories of roles: **Platform Roles** and **Company Roles**.

### Platform Roles (Global)

These roles are assigned to a `User` and are independent of any company.

- **`super-admin`**: The highest-level administrator. Can manage platform settings, other users (including other `super-admin`s and `qa` users), and has access to all data.
- **`qa`**: A role for the Quality Assurance team. Has specific permissions for testing and validation purposes.
- **`user`**: The default role for any new user on the platform.

### Company Roles (Scoped to a Company)

These roles define a `User`'s permissions *within* a specific `Company`.

- **`owner`**: The primary administrator of a `Company`. Typically the person who created the company account. Has full control over the company's settings and team members.
- **`admin`**: A secondary administrator. Can manage team members and company settings, but cannot delete the company or remove the owner.
- **`employee`**: A standard user within a company. Has access to the company's services but cannot manage settings or other team members.

---

## 3. Implementation Plan

### Phase 1: Update Types and Mock Data

- [ ] **Refine `User` Type**: Add the `platformRole` (`super-admin`, `qa`, `user`) to the main `User` type in `src/types/api/user.ts`.
- [ ] **Refine `TeamMember` Type**: Clarify that `TeamMember` is a `User` with an added `companyRole` (`owner`, `admin`, `employee`). It should likely extend the `User` type or be a composite type.
- [ ] **Create `Company` Type**: Create a new type for `Company` in `src/types/api/company.ts`.
- [ ] **Update Mock Data**: 
    - Modify `user-data.ts` to include the new `platformRole`.
    - Modify `team-data.ts` to reflect that it's a list of `Users` associated with a sample company, including their `companyRole`.
    - Create `company-data.ts` with mock company information.

### Phase 2: Refactor Application Logic

- [ ] **Signup Flow (`SignupView.tsx`)**: Update the signup logic to:
    1. Create a new `Company`.
    2. Create a new `User` with `platformRole: 'user'`.
    3. Create a `Membership` linking the `User` to the `Company` with `companyRole: 'owner'`.
- [ ] **Team Invitation Flow (`CreateTeamMemberPage.tsx`)**: Update the logic to:
    1. Check if an invited user already exists on the platform.
    2. If not, create a new `User` with `platformRole: 'user'`.
    3. Create a `Membership` linking the `User` to the current `Company` with the selected `companyRole`.
- [ ] **Admin Panel (`UsersPage.tsx`)**: Update the logic to allow `super-admin`s to view all users and manage their `platformRole`.

### Phase 3: API and Backend Alignment

- [ ] **Update Mock API Handlers**: Align all mock API handlers (`GET`, `POST`, `PATCH`) with the new data structures and logic.
- [x] **Document API Endpoints**: Ensure the API documentation (if any) reflects the new request/response payloads for users, teams, and companies.

---

## 4. API Endpoints

This section documents the key API endpoints that support the user and role management architecture.

### Authentication

#### `POST /api/signup`

Creates a new `Company` and a new `User` who becomes the `owner` of that company.

-   **Request Body**:
    ```json
    {
      "companyName": "string",
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
-   **Response (Success)**:
    ```json
    {
      "data": {
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "platformRole": "user"
        }
      },
      "message": "Signup successful."
    }
    ```

### Platform Administration (Super Admin)

These endpoints require the requester to have a `platformRole` of `super-admin`.

#### `GET /api/admin/users`

Fetches a list of all users on the platform.

-   **Response (Success)**:
    ```json
    {
      "data": {
        "users": [
          {
            "id": "string",
            "name": "string",
            "email": "string",
            "platformRole": "user" | "qa" | "super-admin",
            "status": "active" | "invited" | "inactive",
            "companyId": "string"
          }
        ]
      }
    }
    ```

#### `PATCH /api/admin/users/:id`

Updates a user's `platformRole` or `status`.

-   **Request Body**:
    ```json
    {
      "platformRole": "user" | "qa" | "super-admin",
      "status": "active" | "invited" | "inactive"
    }
    ```
-   **Response (Success)**:
    ```json
    {
      "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "platformRole": "user" | "qa" | "super-admin",
        "status": "active" | "invited" | "inactive",
        "companyId": "string"
      }
    }
    ```

### Company Team Management

These endpoints are scoped to a specific company and are typically called by a company `owner` or `admin`.

#### `POST /api/team`

Invites a new member to the company. This creates a new `User` if one doesn't exist with the given email, and creates the team membership.

-   **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string",
      "companyRole": "admin" | "employee"
    }
    ```
-   **Response (Success)**:
    ```json
    {
      "data": {
        "member": {
          "id": "string",
          "name": "string",
          "email": "string",
          "platformRole": "user",
          "companyRole": "admin" | "employee",
          "status": "invited",
          "lastActive": "string"
        }
      }
    }
    ```
