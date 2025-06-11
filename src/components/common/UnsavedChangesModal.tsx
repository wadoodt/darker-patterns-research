// src/components/common/UnsavedChangesModal.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // If modal itself navigates
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // If you want an X button
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onLeave: () => void; // Called when user confirms they want to leave (discarding changes)
  onStay: () => void; // Called when user decides to stay
  nextPath?: string | null; // The path to navigate to if "Leave" is chosen
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({ isOpen, onLeave, onStay, nextPath }) => {
  const router = useRouter();

  const handleLeaveClick = () => {
    onLeave(); // Parent handles state changes like hasUnsavedChanges = false
    // Navigation can be handled by the parent that called onLeave, or here:
    // if (nextPath) {
    //   router.push(nextPath);
    // }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onStay()}>
      <DialogContent className="bg-light-bg-secondary border-light-border-primary sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="survey-section-title flex items-center !text-lg">
            <AlertTriangle size={22} className="mr-2 text-yellow-500" />
            Unsaved Changes
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-light-text-secondary py-4 text-sm">
          You have unsaved changes on this page. Are you sure you want to leave? Your progress on the current step will
          be lost.
        </DialogDescription>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onStay} className="btn-secondary-light text-xs">
            Stay on Page
          </Button>
          <Button
            onClick={handleLeaveClick}
            className="btn-primary-light bg-red-500 text-xs text-white hover:bg-red-600"
          >
            Leave &amp; Discard Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnsavedChangesModal;
