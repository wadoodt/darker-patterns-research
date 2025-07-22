import { useParams } from 'react-router-dom';
import { useAsyncCache } from '../../../hooks/useAsyncCache';
import api from '../../../api/client';
import type { SupportTicket, TicketMessage } from '../../../types/support-ticket';
import { CacheLevel } from '../../../lib/cache/types';
import { Box, Button, Card, Flex, Heading, Text, TextArea, Spinner, Callout, Badge } from '@radix-ui/themes';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const replySchema = z.object({
  message: z.string().min(1, 'Reply message cannot be empty.').max(5000),
});

type ReplyFormData = z.infer<typeof replySchema>;

const UserTicketDetailPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const { data, loading: isLoading, error, refresh } = useAsyncCache<{ ticket: SupportTicket }>(
    [`ticket-${ticketId}`],
    async () => (await api.get(`/support/tickets/${ticketId}`)).data,
    CacheLevel.DEBUG,
    { enabled: !!ticketId }
  );

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const onSubmit = async (formData: ReplyFormData) => {
    try {
      await api.post(`/api/support/tickets/${ticketId}/reply`, formData);
      reset();
      refresh();
    } catch (err) {
      console.error('Failed to post reply', err);
    }
  };

  if (isLoading) return <Spinner />; 
  if (error) return <Callout.Root color="red">Error loading ticket details: {error.message}</Callout.Root>;
  if (!data?.ticket) return <Callout.Root>Ticket not found.</Callout.Root>;

  const { ticket } = data;

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Heading as="h1">Ticket: {ticket.subject}</Heading>
        <Card>
          <Flex direction="column" gap="2" p="3">
            <Text><strong>Email:</strong> {ticket.email}</Text>
            <Text><strong>Status:</strong> <Badge color={ticket.status === 'open' ? 'red' : ticket.status === 'in_progress' ? 'yellow' : 'green'}>{ticket.status}</Badge></Text>
            <Text><strong>Submitted:</strong> {new Date(ticket.createdAt).toLocaleString()}</Text>
          </Flex>
        </Card>

        <Heading as="h2" size="4" mb="2">Conversation</Heading>
        <Flex direction="column" gap="3">
          {ticket.messages.map((message: TicketMessage, index: number) => (
            <Card key={index} variant={message.author === 'user' ? 'surface' : 'classic'}>
              <Box p="3">
                <Text as="p" weight="bold">{message.author === 'user' ? 'You' : 'Support Team'}</Text>
                <Text as="p">{message.content}</Text>
                <Text as="p" size="1" color="gray">{new Date(message.createdAt).toLocaleString()}</Text>
              </Box>
            </Card>
          ))}
        </Flex>

        {ticket.status !== 'closed' && (
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 'var(--space-6)' }}>
            <Heading as="h3" size="4" mb="2">Post a Reply</Heading>
            <TextArea
              placeholder="Type your reply here..."
              {...register('message')}
              style={{ height: 120 }}
            />
            {errors.message && <Callout.Root color="red" size="1" mt="2"><Callout.Text>{errors.message.message}</Callout.Text></Callout.Root>}
            <Button type="submit" mt="3" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : 'Submit Reply'}
            </Button>
          </form>
        )}
      </Flex>
    </Box>
  );
};

export default UserTicketDetailPage;
