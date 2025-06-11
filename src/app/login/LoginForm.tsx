import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { LoginFormValues } from '@/lib/auth/loginSchema';
import { AlertTriangle, Eye, EyeOff, LogIn } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isSubmitting: boolean;
  error?: string;
}

export function LoginForm({ form, onSubmit, showPassword, setShowPassword, isSubmitting, error }: LoginFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text-secondary">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  className="bg-dark-bg-tertiary border-dark-bg-tertiary/50 text-dark-text-primary focus:border-brand-purple-500"
                  {...field}
                />
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
              <FormLabel className="text-dark-text-secondary">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="bg-dark-bg-tertiary border-dark-bg-tertiary/50 text-dark-text-primary focus:border-brand-purple-500"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-dark-bg-tertiary/50 absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="flex items-center gap-1.5 text-sm text-red-400">
            <AlertTriangle size={16} />
            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="btn-cta-dark bg-brand-purple-500 hover:bg-brand-purple-600 w-full justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Signing in...'
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
