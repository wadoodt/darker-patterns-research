import { useParams } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { SupportTicket } from "types/support-ticket";
import { CacheLevel } from "@lib/cache/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const replySchema = z.object({
  message: z.string().min(1, "Reply message cannot be empty.").max(5000),
});

export type ReplyFormData = z.infer<typeof replySchema>;

export function useUserTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();

  const {
    data,
    loading: isLoading,
    error,
    refresh,
  } = useAsyncCache<{ ticket: SupportTicket }>(
    [`ticket-${ticketId}`],
    async () => (await api.get(`/support/tickets/${ticketId}`)).data,
    CacheLevel.DEBUG,
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
      await api.post(`/api/support/tickets/${ticketId}/reply`, formData);
      reset();
      refresh();
    } catch {
      // error handling will be done in the component
    }
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
