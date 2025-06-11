'use client';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/lib/auth/loginSchema';
import { loginWithEmail } from '@/lib/auth/loginWithEmail';
import { auth } from '@/lib/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Auth, AuthError } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginView } from './LoginView';

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-dark-text-primary flex items-center gap-3">
        <div className="text-brand-purple-500 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

function LoginFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [displayReason, setDisplayReason] = useState<string>();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle admin access reasons
  const reason = searchParams.get('reason');
  useEffect(() => {
    if (reason === 'unauthorized') {
      setDisplayReason("Access Denied: Your account doesn't have admin privileges.");
    } else if (reason === 'unauthenticated') {
      setDisplayReason('Please log in to access the admin dashboard.');
    } else {
      setDisplayReason(undefined);
    }
  }, [reason]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      // Always redirect to the requested URL or home
      const redirectUrl = searchParams.get('redirect') || '/';
      router.replace(redirectUrl);
    }
  }, [user, loading, router, searchParams]);

  if (loading || user) {
    return <LoadingSpinner />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError(undefined);
    setDisplayReason(undefined);
    setIsSubmitting(true);

    try {
      await loginWithEmail({
        auth: auth as Auth,
        email: data.email,
        password: data.password,
        searchParams,
        router,
      });
    } catch (err) {
      console.error('Firebase login error:', err);
      const authError = err as AuthError;

      if (
        authError.code === 'auth/user-not-found' ||
        authError.code === 'auth/wrong-password' ||
        authError.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (authError.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to too many failed login attempts. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginView
      form={form}
      onSubmit={onSubmit}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      isSubmitting={isSubmitting}
      error={error}
      displayReason={displayReason}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginFormContainer />
    </Suspense>
  );
}
