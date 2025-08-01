import { Card, Box, Text, Flex, Heading } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { TicketMessage } from "@api/domains/support/types";

interface TicketMessagesListProps {
  messages: TicketMessage[];
}

const TicketMessagesList = ({ messages }: TicketMessagesListProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Heading as="h2" size="4" mb="2">
        {t("tickets.conversation")}
      </Heading>
      <Flex direction="column" gap="3">
        {messages.map((message, index) => (
          <Card
            key={index}
            variant={message.author === "support" ? "surface" : "classic"}
          >
            <Box p="3">
              <Text as="p" weight="bold">
                {message.author === "support"
                  ? t("tickets.supportTeam")
                  : t("tickets.user")}
              </Text>
              <Text as="p" color="gray" size="2" mb="2">
                {new Date(message.createdAt).toLocaleString()}
              </Text>
              <Text as="p">{message.content}</Text>
            </Box>
          </Card>
        ))}
      </Flex>
    </>
  );
};

export default TicketMessagesList;
