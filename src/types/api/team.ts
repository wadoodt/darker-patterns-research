export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  status: "active" | "invited" | "inactive";
  lastActive: string;
};

export type TeamMembersResponse = {
  members: TeamMember[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
};
