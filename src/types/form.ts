import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { LoginFormValues } from '@/lib/validations/login';
import type { SignupFormValues } from '@/lib/validations/signup';
import type { ReactNode } from 'react';
import type { LoginReason } from '@/lib/auth/types';

// Base form props that can be reused across components
export interface BaseFormProps<T extends FieldValues> {
  onSubmit: (data: T) => void | Promise<void>;
  error?: string;
  isSubmitting?: boolean;
  children?: ReactNode;
}

// Login form props
export interface LoginFormProps extends BaseFormProps<LoginFormValues> {
  form: UseFormReturn<LoginFormValues>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

// Admin login form props
export interface AdminLoginFormProps extends LoginFormProps {
  loginReason?: LoginReason;
}

// Signup form props
export interface SignupFormProps extends BaseFormProps<SignupFormValues> {
  form: UseFormReturn<SignupFormValues>;
}

// Props for controlled form fields
export interface ControlledFormFieldProps {
  name: string;
  label: string;
  error?: string;
  placeholder?: string;
  className?: string;
  type?: string;
}
