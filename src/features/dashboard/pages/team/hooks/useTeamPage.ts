import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { useCache } from "@contexts/CacheContext";
import api from "@api/index";
import type { TeamMember, NewTeamMember } from "@api/types";
import { CacheLevel } from "@lib/cache/types";
import { ApiError } from "@api/lib/ApiError";

// The data fetching function is now incredibly clean.
// The `api.team.query` method handles the request, error handling, and data unwrapping.
const fetchTeamMembers = async () => {
  return api.team.query();
};

export const useTeamPage = () => {
  const { invalidateByPattern: invalidate } = useCache();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, loading, error, refresh } = useAsyncCache(
    ["team-members", currentPage],
    fetchTeamMembers,
    CacheLevel.STABLE,
  );

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const teamMembers: TeamMember[] = data?.members || [];
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
    if (error) {
      return "UNEXPECTED_ERROR";
    }
    return null;
  }, [error]);

  const handleCreateMember = async (newMember: NewTeamMember) => {
    setFormErrors(null);
    const response = await api.team.create(newMember);

    if (response.error) {
      console.error("Failed to create team member", response.error);
      setFormErrors(response.error.validations || { general: response.error.message });
    } else {
      await invalidate("^team-members");
      // Optionally, close a modal or redirect here on success
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const response = await api.team.remove(memberId);
    if (response.error) {
      console.error("Failed to delete team member", response.error);
      setFormErrors({ general: response.error.message });
    } else {
      await invalidate("^team-members");
    }
  };

  const handleUpdateMember = async (member: TeamMember) => {
    setFormErrors(null);
    const response = await api.team.update(member);

    if (response.error) {
      console.error("Failed to update team member", response.error);
      setFormErrors(response.error.validations || { general: response.error.message });
    } else {
      await invalidate("^team-members");
    }
  };

  const handleUpdatePlatformRole = async (
    memberId: string,
    platformRole: "admin" | "user",
  ) => {
    const response = await api.team.update({ id: memberId, platformRole });
    if (response.error) {
      console.error("Failed to update platform role", response.error);
      setFormErrors({ general: response.error.message });
    } else {
      await invalidate("^team-members");
    }
  };

  return {
    loading,
    error: !!error,
    errorMessage,
    formErrors,
    teamMembers,
    pagination,
    setCurrentPage,
    handleCreateMember,
    handleDeleteMember,
    handleUpdateMember,
    handleUpdatePlatformRole,
    invalidateCache: refresh,
  };
};
