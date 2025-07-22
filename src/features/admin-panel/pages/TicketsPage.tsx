import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Table, Badge, DropdownMenu, IconButton, Button } from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useAsyncCache } from '../../../hooks/useAsyncCache';
import api from '../../../api/client';
import type { SupportTicket } from '../../../types/support-ticket';

const fetchAdminTickets = async (page: number) => {
  const response = await api.get(`/admin/tickets?page=${page}&limit=10`);
  return response.data;
};

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error, refresh } = useAsyncCache(
    ['admin-tickets', currentPage],
    () => fetchAdminTickets(currentPage),
    'PERSISTENT',
  );

  const handleStatusChange = async (ticketId: string, status: 'open' | 'in_progress' | 'closed') => {
    try {
      await api.patch(`/admin/tickets/${ticketId}`, { status });
      refresh(); // Re-fetch the data to update the UI
    } catch (err) {
      console.error('Failed to update ticket status', err);
      // Optionally, show an error message to the user
    }
  };

  const tickets: SupportTicket[] = data?.data?.tickets || [];
  const pagination = data?.data?.pagination;
  const errorMessage = error ? 'Failed to load tickets' : null;

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Heading as="h1">Support Tickets</Heading>
      </Flex>
      {loading && <p>Loading tickets...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!loading && !error && tickets.length > 0 && (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map((ticket: SupportTicket) => (
              <Table.Row key={ticket.id}>
                <Table.Cell>{ticket.subject}</Table.Cell>
                <Table.Cell>{ticket.email}</Table.Cell>
                <Table.Cell>
                  <Badge color={ticket.status === 'open' ? 'red' : ticket.status === 'in_progress' ? 'yellow' : 'green'}>
                    {ticket.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="ghost">
                        <DotsVerticalIcon />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item onClick={() => navigate(`/admin-panel/tickets/${ticket.id}`)}>View Details</DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item onClick={() => handleStatusChange(ticket.id, 'open')}>Mark as Open</DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => handleStatusChange(ticket.id, 'in_progress')}>Mark as In Progress</DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => handleStatusChange(ticket.id, 'closed')}>Mark as Closed</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
                <Table.Cell>{new Date(ticket.createdAt).toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
      {!loading && !error && tickets.length === 0 && <p>No tickets found.</p>}
      <Flex justify="between" mt="4">
        <Button onClick={() => setCurrentPage(p => p - 1)} disabled={!pagination || pagination.currentPage === 1}>Previous</Button>
        <span>Page {pagination?.currentPage} of {pagination?.totalPages}</span>
        <Button onClick={() => setCurrentPage(p => p + 1)} disabled={!pagination || pagination.currentPage === pagination.totalPages}>Next</Button>
      </Flex>
    </Box>
  );
};

export default TicketsPage;
