import React from "react";
import { Flex, Button } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

interface PaginationSectionProps {
  pagination: { currentPage: number; totalPages: number } | undefined;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PaginationSection: React.FC<PaginationSectionProps> = ({
  pagination,
  setCurrentPage,
}) => {
  const { t } = useTranslation();
  return (
    <Flex justify="between" mt="4">
      <Button
        onClick={() => setCurrentPage((p) => p - 1)}
        disabled={!pagination || pagination.currentPage === 1}
      >
        {t("tickets.previous")}
      </Button>
      <span>
        {t("tickets.pageInfo", {
          currentPage: pagination?.currentPage,
          totalPages: pagination?.totalPages,
        })}
      </span>
      <Button
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={
          !pagination || pagination.currentPage === pagination.totalPages
        }
      >
        {t("tickets.next")}
      </Button>
    </Flex>
  );
};
