
import { useState } from "react";
import { Select, Button, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useUpdateAdminTicket } from "@api/domains/admin/hooks";
import type { SupportTicket } from "@api/domains/support/types";

interface TicketStatusUpdaterProps {
  ticket: SupportTicket;
  onStatusChange: () => void;
}

const TicketStatusUpdater = ({
  ticket,
  onStatusChange,
}: TicketStatusUpdaterProps) => {
  const { t } = useTranslation();
  const [newStatus, setNewStatus] = useState<"open" | "in_progress" | "closed">(
    ticket.status,
  );
  const { mutate: updateTicket, isLoading: isUpdating } = useUpdateAdminTicket();

  const handleUpdateStatus = async () => {
    try {
      await updateTicket(ticket.id, { status: newStatus });
      onStatusChange();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  return (
    <Flex gap="3" align="center">
      <Select.Root
        value={newStatus}
        onValueChange={(value) =>
          setNewStatus(value as "open" | "in_progress" | "closed")
        }
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="open">{t("tickets.status.open")}</Select.Item>
          <Select.Item value="in_progress">
            {t("tickets.status.in_progress")}
          </Select.Item>
          <Select.Item value="closed">{t("tickets.status.closed")}</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button
        onClick={handleUpdateStatus}
        disabled={isUpdating || newStatus === ticket.status}
      >
        {isUpdating ? t("tickets.status.updating") : t("tickets.status.update")}
      </Button>
    </Flex>
  );
};

export default TicketStatusUpdater;
