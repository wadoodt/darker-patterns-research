// src/components/survey/FlagEntryModal.tsx
'use client';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface FlagEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFlag: (reason: string, comment: string) => void;
  entryId: string | null;
}

const flagReasonsList = [
  'Instruction is unclear or confusing.',
  'Option A seems problematic/harmful.',
  'Option B seems problematic/harmful.',
  'Both options seem problematic/harmful.',
  'Content is offensive or inappropriate.',
  'Other (please specify below)',
];

const FlagEntryModal: React.FC<FlagEntryModalProps> = ({ isOpen, onClose, onSubmitFlag, entryId }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReasonComment, setOtherReasonComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset local state when modal is closed
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
    // Pass the original selectedReason (which might be "Other...") and the otherReasonComment separately
    onSubmitFlag(selectedReason, otherReasonComment.trim());
    handleOpenChange(false); // Close modal on successful submit
  };

  if (!entryId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-light-bg-secondary border-light-border-primary survey-section-card p-0 sm:max-w-[525px]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="survey-section-title flex items-center text-base sm:text-lg">
            <AlertTriangle size={20} className="mr-2 text-yellow-500" />
            Flag Entry: <span className="ml-1 truncate font-mono text-sm">{entryId.substring(0, 12)}...</span>
          </DialogTitle>
        </DialogHeader>
        <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto px-6 py-2">
          <p className="text-xs text-gray-500">
            If you believe this entry has issues (e.g., unclear instructions, problematic content), please let us know.
          </p>
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-2">
            {flagReasonsList.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={reason}
                  id={`flag-${reason.replace(/\s/g, '-')}`}
                  className="form-radio-input-custom-light !h-3.5 !w-3.5"
                />
                <Label
                  htmlFor={`flag-${reason.replace(/\s/g, '-')}`}
                  className="text-xs leading-tight font-normal text-gray-700 sm:text-sm"
                >
                  {reason}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {selectedReason === 'Other (please specify below)' && (
            <Textarea
              value={otherReasonComment}
              onChange={(e) => setOtherReasonComment(e.target.value)}
              placeholder="Please specify your reason..."
              className="form-textarea-light mt-2 w-full text-xs"
              rows={2}
            />
          )}
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        <DialogFooter className="bg-light-bg-tertiary/50 rounded-b-lg p-6 pt-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="btn-secondary-light text-xs">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} size="sm" className="btn-primary-light text-xs">
            Submit Flag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlagEntryModal;
