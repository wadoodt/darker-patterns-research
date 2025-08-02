import React from "react";
import { Flex, Heading, Button } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderSectionProps {
  onCreate: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ onCreate }) => {
  const { t } = useTranslation();

  return (
    <Flex justify="between" align="center" mb="6">
      <Heading as="h1">{t("articles.manageArticles")}</Heading>
      <Button onClick={onCreate}>
        <PlusIcon size={16} style={{ marginRight: "4px" }} />
        {t("articles.createArticle")}
      </Button>
    </Flex>
  );
};
