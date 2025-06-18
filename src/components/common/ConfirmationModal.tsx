'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass = variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="bg-light-bg-secondary border-light-border-primary sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="survey-section-title flex items-center !text-lg">
            {variant === 'destructive' && <AlertTriangle size={22} className="mr-2 text-yellow-500" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-light-text-secondary py-4 text-sm">{description}</DialogDescription>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onCancel} className="btn-secondary-light text-xs">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} className={`btn-primary-light text-xs text-white ${confirmButtonClass}`}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
