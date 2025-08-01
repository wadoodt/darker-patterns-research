
import { useAsyncCache } from "@hooks/useAsyncCache";
import { team } from "./index";
import type { TeamMember, NewTeamMember } from "./types";

export const useTeamMembers = () => {
  return useAsyncCache(
    ["team", "members"],
    () => team.query(),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useCreateTeamMember = () => {
  const { refresh } = useAsyncCache(["team", "members"], () => Promise.resolve({ members: [], totalPages: 0, currentPage: 1, totalMembers: 0 }));
  
  return {
    mutate: async (newMember: NewTeamMember) => {
      const result = await team.create(newMember);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useUpdateTeamMember = () => {
  const { refresh } = useAsyncCache(["team", "members"], () => Promise.resolve({ members: [], totalPages: 0, currentPage: 1, totalMembers: 0 }));
  
  return {
    mutate: async (member: Partial<TeamMember> & { id: string }) => {
      const result = await team.update(member);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useDeleteTeamMember = () => {
  const { refresh } = useAsyncCache(["team", "members"], () => Promise.resolve({ members: [], totalPages: 0, currentPage: 1, totalMembers: 0 }));
  
  return {
    mutate: async (id: string) => {
      await team.remove(id);
      await refresh();
    },
    isLoading: false,
  };
}; 