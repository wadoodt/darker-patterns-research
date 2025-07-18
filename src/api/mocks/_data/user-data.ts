// src/api/mocks/user-data.ts

import type { User } from "types";

// Seed data for the users table. In a real app, passwords would be hashed.
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    username: "admin",
    email: "admin@example.com",
    password: "password",
    role: "admin",
    companyId: "comp-001",
    status: "active",
  },
  {
    id: "2",
    name: "Regular User",
    username: "user",
    email: "user@example.com",
    password: "password",
    role: "user",
    companyId: "comp-002",
    status: "active",
  },
  {
    id: "3",
    name: "QA User",
    username: "qa",
    email: "qa@example.com",
    password: "password",
    role: "qa",
    companyId: "comp-004",
    status: "active",
  },
];
