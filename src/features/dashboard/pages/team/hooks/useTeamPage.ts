import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { TeamMember, TeamMembersResponse } from "types/api";
import { AxiosError } from "axios";
import { CacheLevel } from "@lib/cache/types";

const fetchTeamMembers = async (page: number) => {
  const { data: response } = await api.get<{ data: TeamMembersResponse }>(
    `/team?page=${page}&limit=10`
  );
  return response.data;
};

export const useTeamPage = () => {
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

  const handleUpdateMember = async (member: TeamMember) => {
    try {
      await api.patch(`/team/${member.id}`, member);
      refresh();
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
    handleUpdateMember,
    invalidateCache: refresh,
  };
};
