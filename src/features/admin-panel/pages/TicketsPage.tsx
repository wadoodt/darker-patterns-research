import { Box } from "@radix-ui/themes";
import { HeaderSection } from "./tickets/sections/HeaderSection";
import { TicketsTableSection } from "./tickets/sections/TicketsTableSection";
import { PaginationSection } from "./tickets/sections/PaginationSection";
import { useTicketsPage } from "./tickets/hooks/useTicketsPage";

const TicketsPage: React.FC = () => {
  const {
    navigate,
    setCurrentPage,
    loading,
    error,
    handleStatusChange,
    tickets,
    pagination,
    errorMessage,
  } = useTicketsPage();

  return (
    <Box>
      <HeaderSection />
      <TicketsTableSection
        tickets={tickets}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        handleStatusChange={handleStatusChange}
        navigate={navigate}
      />
      <PaginationSection
        pagination={pagination}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
};

export default TicketsPage;
