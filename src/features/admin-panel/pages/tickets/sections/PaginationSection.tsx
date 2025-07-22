import React from "react";
import { Flex, Button } from "@radix-ui/themes";

interface PaginationSectionProps {
  pagination: { currentPage: number; totalPages: number } | undefined;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PaginationSection: React.FC<PaginationSectionProps> = ({ pagination, setCurrentPage }) => (
  <Flex justify="between" mt="4">
    <Button
      onClick={() => setCurrentPage((p) => p - 1)}
      disabled={!pagination || pagination.currentPage === 1}
    >
      Previous
    </Button>
    <span>
      Page {pagination?.currentPage} of {pagination?.totalPages}
    </span>
    <Button
      onClick={() => setCurrentPage((p) => p + 1)}
      disabled={!pagination || pagination.currentPage === pagination.totalPages}
    >
      Next
    </Button>
  </Flex>
); 