import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { LoginFormValues } from '@/lib/auth/loginSchema';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { LoginForm } from './LoginForm';

interface LoginViewProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isSubmitting: boolean;
  error?: string;
  displayReason?: string;
}

export function LoginView({
  form,
  onSubmit,
  showPassword,
  setShowPassword,
  isSubmitting,
  error,
  displayReason,
}: LoginViewProps) {
  return (
    <div className="from-dark-bg-primary flex min-h-screen items-center justify-center bg-gradient-to-br to-[#1c162e] p-4">
      <Card className="bg-dark-bg-secondary/90 border-dark-bg-tertiary/50 w-full max-w-sm space-y-4 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto">
            <svg
              className="text-brand-purple-500 mx-auto h-10 w-auto"
              fill="currentColor"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0ZM11.7978 9.28999C11.0898 8.80399 10.1878 9.37799 10.1878 10.212V14.812L15.0118 17.62C15.6058 17.956 15.9998 18.584 15.9998 19.268V23.052C15.9998 23.778 15.1798 24.182 14.5378 23.81L9.45983 20.864C8.86583 20.528 8.47183 19.898 8.47183 19.216V12.788C8.47183 12.104 8.86583 11.476 9.45983 11.138L14.5378 8.19199C15.1798 7.81999 15.9998 8.22199 15.9998 8.94999V13.188L13.5258 14.614C12.8018 15.032 12.4778 15.834 12.7378 16.562C12.9978 17.288 13.7998 17.614 14.5258 17.196L19.2018 14.586C19.8438 14.214 20.2118 13.562 20.2118 12.844V8.94999C20.2118 8.22199 21.0318 7.81999 21.6738 8.19199L22.7518 8.77999C23.3458 9.11599 23.7398 9.74599 23.7398 10.428V19.216C23.7398 20.704 22.6538 21.984 21.2018 22.376L16.5258 23.656C16.3298 23.708 16.1578 23.734 15.9998 23.734C15.4118 23.734 14.8558 23.422 14.5858 22.904L13.0498 20.124C12.9138 19.876 12.6338 19.734 12.3478 19.792C12.0618 19.852 11.8558 20.104 11.8558 20.394V22.012C11.8558 22.738 12.6758 23.142 13.3178 22.77L18.3958 19.822C18.9898 19.486 19.3838 18.856 19.3838 18.172V14.522L21.4738 13.33C22.1978 12.912 22.5218 12.11 22.2618 11.382C22.0018 10.654 21.2018 10.33 20.4758 10.746L13.9858 14.522L11.7978 9.28999Z" />
            </svg>
          </div>
          <CardTitle className="font-heading-display text-dark-text-primary mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Sign In
          </CardTitle>
          <CardDescription className="text-dark-text-secondary">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        {displayReason && (
          <div className="mx-6 flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            <AlertTriangle size={20} />
            <p>{displayReason}</p>
          </div>
        )}

        <CardContent>
          <LoginForm
            form={form}
            onSubmit={onSubmit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isSubmitting={isSubmitting}
            error={error}
          />
        </CardContent>

        <CardFooter className="flex flex-col items-center space-y-2 px-6 pb-6">
          <Button
            variant="link"
            className="text-dark-text-secondary hover:text-dark-text-primary h-auto text-sm"
            asChild
          >
            <Link href="/forgot-password">Forgot your password? Contact an administrator</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
