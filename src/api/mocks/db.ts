import { createTable } from './lib/createTable';
import type { User } from '../../types/api';

// Seed data for the users table. In a real app, passwords would be hashed.
const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    password: "password",
    role: "admin",
    token: "mock-token-for-id-1",
  },
  {
    id: 2,
    username: "user",
    password: "password",
    role: "user",
    token: "mock-token-for-id-2",
  },
];

// The global mock database instance.
export const db = {
  users: createTable(mockUsers),
  // Add other tables here as needed, e.g.:
  // products: createTable(mockProducts),
};


