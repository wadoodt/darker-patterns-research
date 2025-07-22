import React from "react";
import { Table, Badge, DropdownMenu, IconButton } from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import type { SupportTicket } from "types/support-ticket";

interface TicketsTableSectionProps {
  tickets: SupportTicket[];
  loading: boolean;
  error: unknown;
  errorMessage: string | null;
  handleStatusChange: (id: string, status: "open" | "in_progress" | "closed") => void;
  navigate: (path: string) => void;
}

export const TicketsTableSection: React.FC<TicketsTableSectionProps> = ({
  tickets,
  loading,
  error,
  errorMessage,
  handleStatusChange,
  navigate,
}) => {
  if (loading) return <p>Loading tickets...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
  if (!loading && !error && tickets.length === 0) return <p>No tickets found.</p>;
  return (
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
        {tickets.map((ticket) => (
          <Table.Row key={ticket.id}>
            <Table.Cell>{ticket.subject}</Table.Cell>
            <Table.Cell>{ticket.email}</Table.Cell>
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
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost">
                    <DotsVerticalIcon />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    onClick={() =>
                      navigate(`/admin-panel/tickets/${ticket.id}`)
                    }
                  >
                    View Details
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={() => handleStatusChange(ticket.id, "open")}
                  >
                    Mark as Open
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() =>
                      handleStatusChange(ticket.id, "in_progress")
                    }
                  >
                    Mark as In Progress
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleStatusChange(ticket.id, "closed")}
                  >
                    Mark as Closed
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Cell>
            <Table.Cell>
              {new Date(ticket.createdAt).toLocaleString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}; 