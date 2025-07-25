import { Button, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

interface PaginationSectionProps {
  pagination: PaginationProps | null;
  onPageChange: (page: number) => void;
}

export const PaginationSection = ({ 
  pagination, 
  onPageChange 
}: PaginationSectionProps) => {
  const { t } = useTranslation();

  if (!pagination) {
    return null;
  }

  const { currentPage, totalPages } = pagination;

  return (
    <Flex justify="between" align="center" mt="4">
      <Text>
        {t("pagination.page_of", { currentPage, totalPages })}
      </Text>
      <Flex gap="2">
        <Button 
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {t("pagination.previous")}
        </Button>
        <Button 
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {t("pagination.next")}
        </Button>
      </Flex>
    </Flex>
  );
};
