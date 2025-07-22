import { Heading, TextArea, Text, Button, Spinner } from "@radix-ui/themes";
import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type ReplyFormData = {
  content: string;
};

interface TicketReplyFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  errors: FieldErrors<ReplyFormData>;
  register: UseFormRegister<ReplyFormData>;
}

const TicketReplyForm = ({
  onSubmit,
  isSubmitting,
  errors,
  register,
}: TicketReplyFormProps) => (
  <form onSubmit={onSubmit} style={{ marginTop: "var(--space-6)" }}>
    <Heading as="h3" size="4" mb="2">
      Post a Reply
    </Heading>
    <TextArea
      placeholder="Type your reply here..."
      {...register("content")}
      style={{ height: 120 }}
    />
    {errors.content && (
      <Text color="red" size="2" mt="1">
        {errors.content.message}
      </Text>
    )}
    <Button type="submit" mt="3" disabled={isSubmitting}>
      {isSubmitting ? <Spinner /> : "Submit Reply"}
    </Button>
  </form>
);

export default TicketReplyForm;
