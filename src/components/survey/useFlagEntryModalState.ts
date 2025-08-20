import { useState } from 'react';

interface UseFlagEntryModalStateProps {
  onClose: () => void;
  onSubmitFlag: (reason: string, comment: string) => void;
}

export function useFlagEntryModalState({ onClose, onSubmitFlag }: UseFlagEntryModalStateProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReasonComment, setOtherReasonComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setSelectedReason('');
      setOtherReasonComment('');
      setError(null);
    }
  };

  const handleSubmit = () => {
    setError(null);
    if (!selectedReason) {
      setError('Please select a reason for flagging.');
      return;
    }
    const finalReasonText =
      selectedReason === 'Other (please specify below)' ? otherReasonComment.trim() : selectedReason;
    if (!finalReasonText && selectedReason === 'Other (please specify below)') {
      setError("Please specify your reason if 'Other' is selected, or choose a different reason.");
      return;
    }
    onSubmitFlag(selectedReason, otherReasonComment.trim());
    handleOpenChange(false);
  };

  return {
    selectedReason,
    setSelectedReason,
    otherReasonComment,
    setOtherReasonComment,
    error,
    handleOpenChange,
    handleSubmit,
  };
}
