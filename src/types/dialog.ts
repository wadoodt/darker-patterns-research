import type { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import type { DialogProps } from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

// Base dialog/modal props
export interface BaseDialogProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

// Alert dialog props
export interface AlertDialogBaseProps extends BaseDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

// Unsaved changes dialog props
export interface UnsavedChangesDialogProps extends BaseDialogProps {
  onLeave: () => void;
  onStay: () => void;
  nextPath?: string | null;
  handleNavigation?: boolean;
}

// Flag entry dialog props
export interface FlagEntryDialogProps extends BaseDialogProps {
  onClose: () => void;
  onSubmitFlag: (reason: string, comment: string) => void;
  entryId: string | null;
}

// Props for dialog components from @radix-ui/react-dialog
export interface DialogContentProps extends DialogProps {
  showCloseButton?: boolean;
}

// Props for alert dialog components from @radix-ui/react-alert-dialog
export interface AlertDialogContentProps extends AlertDialogProps {
  showCloseButton?: boolean;
}
