import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Table, Badge, Flex, Button } from '@radix-ui/themes';
import { useAsyncCache } from '../../../../../hooks/useAsyncCache';
import api from '../../../../../api/client';
import type { SupportTicket } from '../../../../../types/support-ticket';

const fetchMyTickets = async (page: number) => {
  const response = await api.get(`/support/my-tickets?page=${page}&limit=5`);
  return response.data;
};


const MyTickets: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useAsyncCache(
    ['my-tickets', currentPage],
    () => fetchMyTickets(currentPage),
    'PERSISTENT',
  );

  const tickets: SupportTicket[] = data?.data?.tickets || [];
  const pagination = data?.data?.pagination;
  const errorMessage = error ? 'Failed to load your tickets' : null;

  return (
    <Box mt="8">
      <Heading as="h2" size="6" mb="4">My Support Tickets</Heading>
      {loading && <p>Loading your tickets...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!loading && !error && tickets.length === 0 && (
        <p>You have not submitted any support tickets yet.</p>
      )}
      {!loading && !error && tickets.length > 0 && (
        <>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tickets.map((ticket: SupportTicket) => (
                <Table.Row key={ticket.id}>
                  <Table.Cell>{ticket.subject}</Table.Cell>
                  <Table.Cell>
                    <Badge color={ticket.status === 'open' ? 'red' : ticket.status === 'in_progress' ? 'yellow' : 'green'}>
                      {ticket.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{new Date(ticket.createdAt).toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <Button size="1" onClick={() => navigate(`/support/tickets/${ticket.id}`)}>View</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justify="between" mt="4">
            <Button onClick={() => setCurrentPage(p => p - 1)} disabled={!pagination || pagination.currentPage === 1}>Previous</Button>
            <span>Page {pagination?.currentPage} of {pagination?.totalPages}</span>
            <Button onClick={() => setCurrentPage(p => p + 1)} disabled={!pagination || pagination.currentPage === pagination.totalPages}>Next</Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default MyTickets;
