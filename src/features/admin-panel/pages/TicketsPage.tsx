import React from 'react';
import { Box, Flex, Heading, Table, Badge } from '@radix-ui/themes';
import type { SupportTicket } from '../../../types/support-ticket';

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/tickets');
        const data = await res.json();
        setTickets(data.data?.tickets || []);
      } catch {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Heading as="h1">Support Tickets</Heading>
      </Flex>
      {loading && <p>Loading tickets...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map(ticket => (
              <Table.Row key={ticket.id}>
                <Table.Cell>{ticket.subject}</Table.Cell>
                <Table.Cell>{ticket.email}</Table.Cell>
                <Table.Cell>
                  <Badge color={
                    ticket.status === 'open' ? 'green' :
                    ticket.status === 'in_progress' ? 'yellow' :
                    'gray'
                  }>
                    {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{new Date(ticket.createdAt).toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default TicketsPage;
