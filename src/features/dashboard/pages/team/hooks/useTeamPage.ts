import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { team } from "@api/domains/team";
import { useCache } from "@contexts/CacheContext";
import api from "@api/index";
import type { TeamMember, NewTeamMember } from "@api/types";
import { CACHE_TTL } from "@lib/cache/constants";
import { ApiError } from "@api/lib/ApiError";
import { cacheKeys } from "@api/cacheKeys";

export const useTeamPage = () => {
  const { invalidateCacheKeys } = useCache();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(
    null
  );
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, loading, error, refresh } = useAsyncCache(
    cacheKeys.team.members(currentPage, 10),
    () => team.query({ page: currentPage, limit: 10 }),
    { ttl: CACHE_TTL.IMPORTANT_1_HOUR }
  );

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const pagination = data
    ? {
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.totalMembers,
      }
    : null;

  const errorMessage = useMemo(() => {
    if (error instanceof ApiError) {
      return error.message; // This is now the i18n key
    }
    return error ? "UNEXPECTED_ERROR" : null;
  }, [error]);

  const handleCreateMember = async (newMember: NewTeamMember) => {
    setFormErrors(null);
    try {
      await api.team.create(newMember);
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
      // Optionally, close a modal or redirect here on success
    } catch (error) {
      console.error("Failed to create team member", error);
      if (error instanceof ApiError) {
        setFormErrors({ general: error.message });
      } else {
        setFormErrors({ general: "error.general.internal_server_error" });
      }
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await api.team.remove(memberId);
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
    } catch (error) {
      console.error("Failed to delete team member", error);
      if (error instanceof ApiError) {
        setFormErrors({ general: error.message });
      } else {
        setFormErrors({ general: "error.general.internal_server_error" });
      }
    }
  };

  const handleUpdateMember = async (member: TeamMember) => {
    setFormErrors(null);
    try {
      await api.team.update(member);
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
    } catch (error) {
      console.error("Failed to update team member", error);
      if (error instanceof ApiError) {
        setFormErrors({ general: error.message });
      } else {
        setFormErrors({ general: "error.general.internal_server_error" });
      }
    }
  };

  const handleUpdatePlatformRole = async (
    memberId: string,
    platformRole: "admin" | "user"
  ) => {
    try {
      await api.team.update({ id: memberId, platformRole });
      await invalidateCacheKeys(cacheKeys.team.membersPrefix);
    } catch (error) {
      console.error("Failed to update platform role", error);
      if (error instanceof ApiError) {
        setFormErrors({ general: error.message });
      } else {
        setFormErrors({ general: "error.general.internal_server_error" });
      }
    }
  };

  return {
    loading,
    error: !!error,
    errorMessage,
    formErrors,
    teamMembers: data?.teamMembers || [],
    pagination,
    setCurrentPage,
    handleCreateMember,
    handleDeleteMember,
    handleUpdateMember,
    handleUpdatePlatformRole,
    invalidateCache: refresh,
  };
};
