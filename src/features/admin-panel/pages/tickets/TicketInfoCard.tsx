import { Card, Flex, Text } from "@radix-ui/themes";
import type { SupportTicket } from "../../../../types/support-ticket";

interface TicketInfoCardProps {
  ticket: SupportTicket;
}

const TicketInfoCard = ({ ticket }: TicketInfoCardProps) => (
  <Card mb="4">
    <Flex direction="column" gap="2">
      <Text>
        <strong>User:</strong> {ticket.email}
      </Text>
      <Text>
        <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
      </Text>
    </Flex>
  </Card>
);

export default TicketInfoCard;
