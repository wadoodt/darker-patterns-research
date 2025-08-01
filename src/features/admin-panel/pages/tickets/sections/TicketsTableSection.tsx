import React from "react";
import { Table, Badge, DropdownMenu, IconButton } from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import type { SupportTicket } from "@api/domains/support/types";

interface TicketsTableSectionProps {
  tickets: SupportTicket[];
  loading: boolean;
  error: unknown;
  errorMessage: string | null;
  handleStatusChange: (
    id: string,
    status: "open" | "in_progress" | "closed",
  ) => void;
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
  const { t } = useTranslation();
  if (loading) return <p>{t("tickets.loading")}</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
  if (!loading && !error && tickets.length === 0)
    return <p>{t("tickets.noTickets")}</p>;
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            {t("tickets.subject")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("tickets.email")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            {t("tickets.statusLabel")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            {t("tickets.actions")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            {t("tickets.createdLabel")}
          </Table.ColumnHeaderCell>
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
                {t(`tickets.status.${ticket.status}`)}
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
                    {t("tickets.viewDetails")}
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={() => handleStatusChange(ticket.id, "open")}
                  >
                    {t("tickets.markAsOpen")}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleStatusChange(ticket.id, "in_progress")}
                  >
                    {t("tickets.markAsInProgress")}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleStatusChange(ticket.id, "closed")}
                  >
                    {t("tickets.markAsClosed")}
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
