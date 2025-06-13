'use client';

import { AdminLoginFormFields } from '@/components/auth/AdminLoginFormFields';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoadingScreen } from '@/components/ui/loading';
import { useAuth } from '@/hooks/useAuth';
import { getLoginErrorMessage, signInWithEmail } from '@/lib/auth/login';
import type { LoginReason } from '@/lib/auth/types';
import { loginSchema } from '@/lib/validations/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

const AdminLoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isResearcher, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginReason = searchParams.get('reason') as LoginReason | undefined;
  const [displayReason, setDisplayReason] = useState('');

  // Redirect if user is already logged in and is a researcher
  useEffect(() => {
    if (!authLoading && user && isResearcher) {
      router.replace('/admin');
    }
  }, [user, isResearcher, authLoading, router]);

  useEffect(() => {
    if (loginReason === 'unauthorized') {
      setDisplayReason("Access Denied: Your account doesn't have admin/researcher privileges.");
    } else if (loginReason === 'unauthenticated') {
      setDisplayReason('Please log in to access the admin dashboard.');
    } else {
      setDisplayReason('');
    }
  }, [loginReason]);

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof FirebaseError) {
        setError(getLoginErrorMessage(err));
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still checking auth or user is already valid and redirecting, show loading
  if (authLoading || (user && isResearcher)) {
    return <LoadingScreen />;
  }

  return (
    <AuthCard
      title="Admin Portal Sign-In"
      description={displayReason || 'Sign in to access the admin portal'}
      footer="Forgot your password? Please contact the super administrator."
      className="bg-dark-bg-secondary border-dark-bg-tertiary"
    >
      <AdminLoginFormFields
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        error={error}
        loginReason={loginReason}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </AuthCard>
  );
};

export default AdminLoginPageContent;
