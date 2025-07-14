import { createTable } from './lib/createTable';
import type { User, Company, Profile } from 'types';
import { mockCompanies } from './_data/companies-data.ts';
import { mockProfile } from './_data/user-data.ts';

// Seed data for the users table. In a real app, passwords would be hashed.
const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "password",
    role: "admin",
    token: "mock-token-for-id-1",
  },
  {
    id: 2,
    username: "user",
    email: "user@example.com",
    password: "password",
    role: "user",
    token: "mock-token-for-id-2",
  },
];

// The global mock database instance.
export const db = {
  users: createTable(mockUsers),
  companies: createTable<Company>(mockCompanies),
  profile: createTable<Profile>([mockProfile]),
};


