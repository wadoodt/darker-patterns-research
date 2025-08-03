
import { useAsyncCache } from "@hooks/useAsyncCache";
import { team } from "./index";
import type { TeamMember, NewTeamMember } from "./types";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";

const TEAM_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useTeamMembers = ({ page = 1, limit = 10 }) => {
  return useAsyncCache(
    cacheKeys.team.members(page, limit),
    () => team.query({ page, limit }),
    { ttl: TEAM_CACHE_TTL }
  );
};

export const useTeamMember = (id: string) => {
  return useAsyncCache(cacheKeys.team.member(id), () => team.get(id), {
    ttl: TEAM_CACHE_TTL,
    enabled: !!id,
  });
};

export const useCreateTeamMember = () => {
  const { invalidateCacheKeys } = useCache();

  return {
    mutate: async (newMember: NewTeamMember) => {
      const result = await team.create(newMember);
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
      return result;
    },
  };
};

export const useUpdateTeamMember = () => {
  const { invalidateCacheKeys } = useCache();

  return {
    mutate: async (member: Partial<TeamMember> & { id: string }) => {
      const result = await team.update(member);
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
      await invalidateCacheKeys(cacheKeys.team.memberPrefix(member.id));
      return result;
    },
  };
};

export const useDeleteTeamMember = () => {
  const { invalidateCacheKeys } = useCache();

  return {
    mutate: async (id: string) => {
      await team.remove(id);
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
      await invalidateCacheKeys(cacheKeys.team.memberPrefix(id));
    },
  };
}; 