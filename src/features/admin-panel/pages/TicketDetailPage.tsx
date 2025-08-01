
import { useParams } from "react-router-dom";
import { useTicket, useReplyToTicket } from "@api/domains/support/hooks";
import { Box, Spinner, Callout, Heading, Text } from "@radix-ui/themes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TicketInfoCard from "./tickets/sections/TicketInfoCard";
import TicketMessagesList from "./tickets/sections/TicketMessagesList";
import TicketReplyForm from "./tickets/sections/TicketReplyForm";
import TicketStatusUpdater from "./tickets/sections/TicketStatusUpdater";
import { useTranslation } from "react-i18next";

const replySchema = z.object({
  content: z.string().min(1, "Reply content cannot be empty."),
});

type ReplyFormData = z.infer<typeof replySchema>;

const TicketDetailPage = () => {
  const { t } = useTranslation();
  const { ticketId = "" } = useParams<{ ticketId: string }>();
  const { data: ticket, loading: isLoading, error, refresh: refetch } = useTicket(ticketId);
  const { mutate: replyToTicket, isLoading: isReplying } = useReplyToTicket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const onSubmit = async (formData: ReplyFormData) => {
    try {
      await replyToTicket(ticketId, formData);
      reset();
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Callout.Root color="red">
        {t("tickets.errorLoading")}: {error.message}
      </Callout.Root>
    );
  if (!ticket) return <Text>{t("tickets.notFound")}</Text>;

  return (
    <Box>
      <Heading as="h1" size="6" mb="4">
        {t("tickets.ticket")}: {ticket.subject}
      </Heading>

      <TicketInfoCard ticket={ticket} />

      <Box my="4">
        <TicketStatusUpdater ticket={ticket} onStatusChange={refetch} />
      </Box>

      <TicketMessagesList messages={ticket.messages} />

      <TicketReplyForm
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isReplying}
        errors={errors}
        register={register}
      />
    </Box>
  );
};

export default TicketDetailPage;
