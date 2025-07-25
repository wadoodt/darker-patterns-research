import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { useCache } from "@contexts/CacheContext";
import api from "@api/client";
import type {
  TeamMember,
  TeamMembersResponse,
  NewTeamMember,
} from "types/api";
import { AxiosError } from "axios";
import { CacheLevel } from "@lib/cache/types";

const fetchTeamMembers = async (page: number) => {
  const { data: response } = await api.get<{ data: TeamMembersResponse }>(
    `/team?page=${page}&limit=10`
  );
  return response.data;
};

export const useTeamPage = () => {
  const { invalidateByPattern: invalidate } = useCache();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, loading, error, refresh } = useAsyncCache(
    ["team-members", currentPage],
    () => fetchTeamMembers(currentPage),
    CacheLevel.DEBUG
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
    if (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      return "UNEXPECTED_ERROR";
    }
    return null;
  }, [error]);

    const handleCreateMember = async (newMember: NewTeamMember) => {
    try {
      await api.post("/team", newMember);
      // Invalidate all cache entries starting with 'team-members'
      // to ensure the list is fresh on any page.
      await invalidate("^team-members");
    } catch (error) {
      console.error("Failed to create team member", error);
      // Optionally, set an error message to display in the UI
    }
  };

    const handleDeleteMember = async (memberId: string) => {
    try {
      await api.delete(`/team/${memberId}`);
      await invalidate("^team-members");
    } catch (error) {
      console.error("Failed to delete team member", error);
      // Optionally, set an error message to display in the UI
    }
  };

    const handleUpdateMember = async (member: TeamMember) => {
    try {
      await api.patch(`/team/${member.id}`, member);
      await invalidate("^team-members");
    } catch (error) {
      console.error("Failed to update team member", error);
      // Optionally, set an error message to display in the UI
    }
  };

  return {
    loading,
    error: !!error,
    errorMessage,
    teamMembers,
    pagination,
    setCurrentPage,
    handleCreateMember,
    handleDeleteMember,
    handleUpdateMember,
    invalidateCache: refresh,
  };
};
