import { useUserTicketDetailPage } from "./hooks/useUserTicketDetailPage";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextArea,
  Spinner,
  Callout,
  Badge,
} from "@radix-ui/themes";
import type { SupportTicket, TicketMessage } from "types/support-ticket";
import type { ReplyFormData } from "./hooks/useUserTicketDetailPage";
import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";

interface TicketInfoCardProps {
  ticket: SupportTicket;
  t: (key: string) => string;
}
const TicketInfoCard = ({ ticket, t }: TicketInfoCardProps) => (
  <Card>
    <Flex direction="column" gap="2" p="3">
      <Text>
        <strong>{t("tickets.userLabel")}</strong> {ticket.email}
      </Text>
      <Text>
        <strong>{t("tickets.statusLabel")}</strong>{" "}
        <Badge
          color={
            ticket.status === "open"
              ? "red"
              : ticket.status === "in_progress"
                ? "yellow"
                : "green"
          }
        >
          {t(`tickets.status.${ticket.status}`)}
        </Badge>
      </Text>
      <Text>
        <strong>{t("tickets.submittedLabel")}</strong>{" "}
        {new Date(ticket.createdAt).toLocaleString()}
      </Text>
    </Flex>
  </Card>
);

interface TicketMessagesListProps {
  messages: TicketMessage[];
  t: (key: string) => string;
}
const TicketMessagesList = ({ messages, t }: TicketMessagesListProps) => (
  <Flex direction="column" gap="3">
    {messages.map((message, index) => (
      <Card
        key={index}
        variant={message.author === "user" ? "surface" : "classic"}
      >
        <Box p="3">
          <Text as="p" weight="bold">
            {message.author === "user"
              ? t("tickets.you")
              : t("tickets.supportTeam")}
          </Text>
          <Text as="p">{message.content}</Text>
          <Text as="p" size="1" color="gray">
            {new Date(message.createdAt).toLocaleString()}
          </Text>
        </Box>
      </Card>
    ))}
  </Flex>
);

interface TicketReplyFormProps {
  t: (key: string) => string;
  handleSubmit: UseFormHandleSubmit<ReplyFormData>;
  onSubmit: (data: ReplyFormData) => void;
  register: UseFormRegister<ReplyFormData>;
  errors: FieldErrors<ReplyFormData>;
  isSubmitting: boolean;
}
const TicketReplyForm = ({
  t,
  handleSubmit,
  onSubmit,
  register,
  errors,
  isSubmitting,
}: TicketReplyFormProps) => (
  <form
    onSubmit={handleSubmit(onSubmit)}
    style={{ marginTop: "var(--space-6)" }}
  >
    <Heading as="h3" size="4" mb="2">
      {t("tickets.postReply")}
    </Heading>
    <TextArea
      placeholder={t("tickets.replyPlaceholder")}
      {...register("message")}
      style={{ height: 120 }}
    />
    {errors.message && (
      <Callout.Root color="red" size="1" mt="2">
        <Callout.Text>{errors.message.message}</Callout.Text>
      </Callout.Root>
    )}
    <Button type="submit" mt="3" disabled={isSubmitting}>
      {isSubmitting ? <Spinner /> : t("tickets.submitReply")}
    </Button>
  </form>
);

const UserTicketDetailPage = () => {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    error,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  } = useUserTicketDetailPage();

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Callout.Root color="red">
        {t("tickets.errorLoading")}: {error.message}
      </Callout.Root>
    );
  if (!data?.ticket)
    return <Callout.Root>{t("tickets.notFound")}</Callout.Root>;

  const { ticket } = data;

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Heading as="h1">
          {t("tickets.ticket")}: {ticket.subject}
        </Heading>
        <TicketInfoCard ticket={ticket} t={t} />
        <Heading as="h2" size="4" mb="2">
          {t("tickets.conversation")}
        </Heading>
        <TicketMessagesList messages={ticket.messages} t={t} />
        {ticket.status !== "closed" && (
          <TicketReplyForm
            t={t}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        )}
      </Flex>
    </Box>
  );
};

export default UserTicketDetailPage;
