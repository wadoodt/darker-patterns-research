import type { TeamMember } from "../../../types/api";

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    role: "user",
    status: "invited",
    lastActive: "- ",
  },
  {
    id: "4",
    name: "Mary Williams",
    email: "mary.williams@example.com",
    role: "user",
    status: "inactive",
    lastActive: "3 months ago",
  },
];
