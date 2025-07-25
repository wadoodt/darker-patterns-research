// src/pages/dashboard/TeamPage.tsx
import { Box } from "@radix-ui/themes";
import { useTeamPage } from "./team/hooks/useTeamPage";
import { HeaderSection } from "./team/sections/HeaderSection";
import { TeamMembersTableSection } from "./team/sections/TeamMembersTableSection";
import { PaginationSection } from "./team/sections/PaginationSection";

const TeamPage = () => {
  const { 
    teamMembers, 
    pagination, 
    loading, 
    error, 
    errorMessage, 
    handleUpdateMember,
    handleDeleteMember,
    handleUpdatePlatformRole,
    setCurrentPage 
  } = useTeamPage();

  // TODO: Implement onEdit and onDelete
  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {errorMessage}</span>;
  }

  if (!teamMembers || !pagination) {
    return <span>No data available</span>;
  }

  return (
    <Box>
      <HeaderSection />
      <TeamMembersTableSection 
        members={teamMembers} 
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
        onUpdatePlatformRole={handleUpdatePlatformRole}
      />
      <PaginationSection pagination={pagination} onPageChange={setCurrentPage} />
    </Box>
  );
};

export default TeamPage;
