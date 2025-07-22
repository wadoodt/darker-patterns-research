import { Heading, Text, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export const SupportHeader = () => {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="2" align="center" className="text-center">
      <Heading as="h1" size="8">
        {t("support.header.title")}
      </Heading>
      <Text size="4" color="gray">
        {t("support.header.subtitle")}
      </Text>
    </Flex>
  );
};
