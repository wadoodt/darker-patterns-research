import React from "react";
import { Flex, Heading, Button } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";

interface HeaderSectionProps {
  t: (key: string) => string;
  onCreate: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ t, onCreate }) => (
  <Flex justify="between" align="center" mb="6">
    <Heading as="h1">{t("articlesPage.manageArticles")}</Heading>
    <Button onClick={onCreate}>
      <PlusIcon size={16} style={{ marginRight: "4px" }} />
      {t("articlesPage.createArticle")}
    </Button>
  </Flex>
); 