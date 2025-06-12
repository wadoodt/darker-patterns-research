'use client';

import { AuthCard } from '@/components/auth/AuthCard';
import { SignupFormFields } from '@/components/auth/SignupFormFields';
import { LoadingScreen } from '@/components/ui/loading';
import { useAuth } from '@/hooks/useAuth';
import { createUserAccount, getFirebaseErrorMessage } from '@/lib/auth/signup';
import { signupSchema, type SignupFormValues } from '@/lib/validations/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      isResearcher: false,
    },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    const redirectUrl = searchParams.get('redirect') || '/admin';
    router.push(redirectUrl);
    return null;
  }

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await createUserAccount(data);
      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    } catch (error: unknown) {
      console.error('Signup error:', error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <p>
      Already have an account?{' '}
      <Link href="/login" className="text-primary font-semibold hover:underline">
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthCard title="Create Account" description="Join us to start validating dark patterns." footer={footer}>
      <SignupFormFields form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </AuthCard>
  );
}
