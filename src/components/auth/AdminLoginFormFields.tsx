'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginReason } from '@/lib/auth/types';
import { AlertTriangle, Loader2, LogIn } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface AdminLoginFormFieldsProps {
  form: UseFormReturn<{ email: string; password: string }>;
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
  loginReason?: LoginReason;
}

export function AdminLoginFormFields({ form, onSubmit, isSubmitting, error, loginReason }: AdminLoginFormFieldsProps) {
  const reasonMessages = {
    unauthorized: "Access Denied: Your account doesn't have admin/researcher privileges.",
    unauthenticated: 'Please log in to access the admin dashboard.',
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {loginReason && (
          <div className="flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-yellow-300" />
            <p className="text-sm text-yellow-300">{reasonMessages[loginReason]}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
