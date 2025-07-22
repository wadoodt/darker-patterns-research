import { Card, Box, Text, Flex, Heading } from "@radix-ui/themes";
import type { TicketMessage } from "../../../../types/support-ticket";

interface TicketMessagesListProps {
  messages: TicketMessage[];
}

const TicketMessagesList = ({ messages }: TicketMessagesListProps) => (
  <>
    <Heading as="h2" size="4" mb="2">
      Conversation
    </Heading>
    <Flex direction="column" gap="3">
      {messages.map((message, index) => (
        <Card
          key={index}
          variant={message.author === "support" ? "surface" : "classic"}
        >
          <Box p="3">
            <Text as="p" weight="bold">
              {message.author === "support" ? "Support Team" : "User"}
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

export default TicketMessagesList;
