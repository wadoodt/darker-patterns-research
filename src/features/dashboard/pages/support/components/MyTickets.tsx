import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Table, Badge, Flex, Button } from "@radix-ui/themes";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { cacheKeys } from "@api/cacheKeys";
import { support } from "@api/domains/support";
import type { PaginatedTicketsResponse, SupportTicket } from "@api/domains/support/types";
import { ApiError } from "@api/lib/ApiError";
import { CACHE_TTL } from "@lib/cache/constants";

const MyTickets: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useAsyncCache<PaginatedTicketsResponse>(
    cacheKeys.support.all(currentPage, 5),
    () => support.myTickets({ page: currentPage, limit: 10 }),
    { ttl: CACHE_TTL.STANDARD_5_MIN },
  );

  const pagination = data
    ? {
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.totalItems,
      }
    : { currentPage: 1, totalPages: 1, total: 0 };

  const errorMessage = useMemo(() => {
    if (error instanceof ApiError) return error.message; // i18n key
    return error ? "UNEXPECTED_ERROR" : null;
  }, [error]);

  const tickets = Array.isArray(data) ? data : [];

  if (!tickets || tickets.length === 0) {
    return <p>You have not submitted any support tickets yet.</p>;
  }

  return (
    <Box mt="8">
      <Heading as="h2" size="6" mb="4">
        My Support Tickets
      </Heading>
      {loading && <p>Loading your tickets...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
                    <Badge
                      color={
                        ticket.status === "open"
                          ? "red"
                          : ticket.status === "in_progress"
                            ? "yellow"
                            : "green"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="1"
                      onClick={() => navigate(`/support/tickets/${ticket.id}`)}
                    >
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justify="between" mt="4">
            <Button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={data?.currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default MyTickets;
