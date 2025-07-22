import { useState } from 'react';
import { Select, Button, Flex } from '@radix-ui/themes';
import api from '../../../../api/client';
import type { SupportTicket } from '../../../../types/support-ticket';

interface TicketStatusUpdaterProps {
  ticket: SupportTicket;
  onStatusChange: () => void;
}

const TicketStatusUpdater = ({ ticket, onStatusChange }: TicketStatusUpdaterProps) => {
  const [newStatus, setNewStatus] = useState<'open' | 'in_progress' | 'closed'>(
    ticket.status,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
            await api.patch(`/api/admin/tickets/${ticket.id}`, { status: newStatus });
      onStatusChange();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Flex gap="3" align="center">
            <Select.Root
        value={newStatus}
        onValueChange={(value) =>
          setNewStatus(value as 'open' | 'in_progress' | 'closed')
        }
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="open">Open</Select.Item>
          <Select.Item value="in_progress">In Progress</Select.Item>
          <Select.Item value="closed">Closed</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button onClick={handleUpdateStatus} disabled={isUpdating || newStatus === ticket.status}>
        {isUpdating ? 'Updating...' : 'Update Status'}
      </Button>
    </Flex>
  );
};

export default TicketStatusUpdater;
