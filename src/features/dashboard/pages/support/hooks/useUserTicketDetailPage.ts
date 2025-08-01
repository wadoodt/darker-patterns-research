import { useParams } from "react-router-dom";
import { useTicket, useReplyToTicket } from "@api/domains/support/hooks";
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
    data: ticket,
    loading: isLoading,
    error,
    refresh,
  } = useTicket(ticketId!);

  const { mutate: replyToTicket } = useReplyToTicket();
  
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
      await replyToTicket(ticketId!, { content: formData.message });
      reset();
      refresh();
    } catch {
      // error handling will be done in the component
    }
  };

  return {
    data: ticket ? { ticket } : null,
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
