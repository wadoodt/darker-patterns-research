# Database Schema for User and Role Management

This document outlines the SQL database schema that corresponds to the application's user, company, and role architecture.

## 1. Core Tables

### `companies`

Stores information about each distinct company.

```sql
CREATE TYPE company_plan_enum AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE company_status_enum AS ENUM ('active', 'trialing', 'past_due', 'canceled');

CREATE TABLE companies (
    id VARCHAR(255) PRIMARY KEY,       -- e.g., 'comp-001'
    name VARCHAR(255) NOT NULL,         -- e.g., 'PenguinMails Inc.'
    
    -- Billing & Subscription
    stripe_customer_id VARCHAR(255) UNIQUE,
    plan company_plan_enum NOT NULL DEFAULT 'free',
    status company_status_enum NOT NULL DEFAULT 'trialing',
    
    -- Legal & Contact
    official_email VARCHAR(255),
    tax_id VARCHAR(255),
    tax_id_country VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: The concept of a single 'owner' is deprecated. Ownership is now managed by assigning
-- the 'owner' role to one or more users in the `company_memberships` table.
```

### `users`

Stores global information for every user on the platform. The `platform_role` is defined here, as it is a global attribute.

```sql
CREATE TYPE platform_role_enum AS ENUM ('user', 'qa', 'super-admin');

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,            -- e.g., 'user-123'
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,    -- Never store plain text passwords
    platform_role platform_role_enum NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `company_memberships`

This is a join table that connects a `user` to a `company` and defines their role and status within that specific company. It is the foundation of our multi-tenancy model.

```sql
CREATE TYPE company_role_enum AS ENUM ('owner', 'admin', 'employee');
CREATE TYPE membership_status_enum AS ENUM ('active', 'invited', 'inactive');

CREATE TABLE company_memberships (
    user_id VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    -- Defines the user's permissions role *within this company*.
    -- Named `company_role` to distinguish it from the global `platform_role`.
    company_role company_role_enum NOT NULL,
    status membership_status_enum NOT NULL DEFAULT 'invited',
    last_active TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, company_id),  -- A user can only have one role per company
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

## 2. How It Maps to Our Types

-   **`User` Type**: Corresponds directly to the `users` table. The `companyId` field in our mock `User` type is replaced by the `company_memberships` table, which provides a more flexible, many-to-many relationship.

-   **`Company` Type**: Corresponds directly to the `companies` table.

-   **`TeamMember` Type**: This is a composite object created by joining `users` and `company_memberships`. When you fetch the team for a specific company, you would perform a query like this:

    ```sql
    SELECT
        u.id,
        u.name,
        u.email,
        u.platform_role,
        tm.company_role,
        tm.status,
        tm.last_active
    FROM users u
    JOIN company_memberships cm ON u.id = cm.user_id
    WHERE cm.company_id = 'your-company-id';
    ```

This schema provides a robust and scalable foundation for managing roles and permissions.
