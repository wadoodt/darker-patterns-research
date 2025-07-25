export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  status: "active" | "invited" | "inactive";
  lastActive: string;
};

export type NewTeamMember = {
  name: string;
  email: string;
  role: "admin" | "user";
};

export type TeamMembersResponse = {
  members: TeamMember[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
};
