import { Card, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { SupportTicket } from "types/support-ticket";

interface TicketInfoCardProps {
  ticket: SupportTicket;
}

const TicketInfoCard = ({ ticket }: TicketInfoCardProps) => {
  const { t } = useTranslation();
  return (
    <Card mb="4">
      <Flex direction="column" gap="2">
        <Text>
          <strong>{t("tickets.userLabel")}</strong> {ticket.email}
        </Text>
        <Text>
          <strong>{t("tickets.createdLabel")}</strong> {new Date(ticket.createdAt).toLocaleString()}
        </Text>
      </Flex>
    </Card>
  );
};

export default TicketInfoCard;
