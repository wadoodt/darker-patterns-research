import Button from "@components/Button";
import { Flex, Heading } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const HeaderSection = () => {
  const { t } = useTranslation();

  return (
    <Flex justify="between" align="center" mb="4">
      <Heading as="h1" size="6">
        {t("team.header")}
      </Heading>
      <Link to="/team/new">
        <Button>{t("team.invite")}</Button>
      </Link>
    </Flex>
  );
};
