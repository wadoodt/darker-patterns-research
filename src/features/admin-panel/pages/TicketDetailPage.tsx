import { useParams } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { SupportTicket } from "types/support-ticket";
import { CacheLevel } from "@lib/cache/types";
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
  const { ticketId = null } = useParams<{ ticketId: string }>();

  const {
    data,
    loading: isLoading,
    error,
    refresh,
  } = useAsyncCache<SupportTicket>(
    [`ticket-${ticketId}`],
    async () => {
      const { data, status } = await api.get(
        `/support/tickets/${ticketId}`,
      );
      if (status !== 200) {
        throw new Error(data.message);
      }
      return data;
    },
    CacheLevel.STANDARD,
    { enabled: !!ticketId },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const onSubmit = async (formData: ReplyFormData) => {
    try {
      await api.post(`/support/tickets/${ticketId}/reply`, formData);
      refresh(); // Refresh ticket data to show the new reply
      reset(); // Clear the form
    } catch (err) {
      console.error("Failed to submit reply:", err);
      // Optionally, show an error message to the user
    }
  };

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Callout.Root color="red">
        {t("tickets.errorLoading")}: {t(error.message)}
      </Callout.Root>
    );
  if (!data) return <Text>{t("tickets.notFound")}</Text>;

  return (
    <Box>
      <Heading as="h1" size="6" mb="4">
        {t("tickets.ticket")}: {data.subject}
      </Heading>

      <TicketInfoCard ticket={data} />

      <Box my="4">
        <TicketStatusUpdater ticket={data} onStatusChange={refresh} />
      </Box>

      <TicketMessagesList messages={data.messages} />

      <TicketReplyForm
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
        register={register}
      />
    </Box>
  );
};

export default TicketDetailPage;
