import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Table, Badge, Flex, Button } from "@radix-ui/themes";
import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/index";
import type { SupportTicket } from "types/support-ticket";
import { ApiError } from "@api/lib/ApiError";
import { CACHE_TTL } from "@lib/cache/constants";

const fetchMyTickets = async (page: number) => {
  const response = await api.support.myTickets(page, 5);
  if (!response.data || response.data.length === 0) {
    console.log("no tickets");
    return {
      data: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 5,
    };
  }
  return response;
};

const MyTickets: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useAsyncCache(
    ["my-tickets", currentPage],
    () => fetchMyTickets(currentPage),
    { ttl: CACHE_TTL.STANDARD_5_MIN },
  );

  const errorMessage = useMemo(() => {
    if (error instanceof ApiError) return error.message; // i18n key
    return error ? "UNEXPECTED_ERROR" : null;
  }, [error]);

  const tickets = Array.isArray(data?.data) ? data.data : [];

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
              Page {data?.currentPage} of {data?.totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={
                !data?.currentPage || data?.currentPage === data?.totalPages
              }
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
