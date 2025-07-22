import React from "react";
import { Flex, Heading } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export const HeaderSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Flex justify="between" align="center" mb="6">
      <Heading as="h1">{t("tickets.header")}</Heading>
    </Flex>
  );
};
