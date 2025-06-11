// components/admin/AdminLoginPageContent.tsx
'use client'; // This is a client component due to form handling and hooks

import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { AlertTriangle, Loader2, LogIn } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
// import { DPVLogo } from '../common/Icons'; // Assuming you create a DPVLogo component

const AdminLoginPageContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from loading to avoid conflict

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isResearcher, loading: authLoading } = useAuth(); // Changed currentUser to user

  const reason = searchParams.get('reason');
  const [displayReason, setDisplayReason] = useState('');

  useEffect(() => {
    if (reason === 'unauthorized') {
      setDisplayReason("Access Denied: Your account doesn't have admin/researcher privileges.");
    } else if (reason === 'unauthenticated') {
      setDisplayReason('Please log in to access the admin dashboard.');
    } else {
      setDisplayReason('');
    }
  }, [reason]);

  // Redirect if user is already logged in and is a researcher
  useEffect(() => {
    if (!authLoading && user && isResearcher) {
      // Changed currentUser to user
      router.replace('/admin/overview'); // Use replace to avoid login page in history
    }
  }, [user, isResearcher, authLoading, router]); // Changed currentUser to user

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDisplayReason(''); // Clear reason messages on new attempt
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth as Auth, email, password);
      // `onAuthStateChanged` in AuthContext will handle fetching user data
      // and updating `isResearcher`. The useEffect above will then redirect.
      router.push('/admin/overview'); // Optimistic redirect
    } catch (err: any) {
      console.error('Firebase login error:', err.code, err.message);
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to too many failed login attempts. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still checking auth or user is already valid and redirecting, show loading
  if (authLoading || (user && isResearcher)) {
    // Changed currentUser to user
    return (
      <div className="bg-dark-bg-primary text-dark-text-primary flex min-h-screen items-center justify-center">
        <Loader2 className="text-brand-purple-400 h-8 w-8 animate-spin" />
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="from-dark-bg-primary text-dark-text-primary flex min-h-screen items-center justify-center bg-gradient-to-br to-[#1c162e] p-4">
      <div className="w-full max-w-sm space-y-8">
        {' '}
        {/* Reduced max-w for a tighter login form */}
        <div className="text-center">
          {/* <DPVLogo className="mx-auto h-12 w-auto text-brand-purple-400" /> */}
          <svg
            className="text-brand-purple-500 mx-auto h-10 w-auto"
            fill="currentColor"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0ZM11.7978 9.28999C11.0898 8.80399 10.1878 9.37799 10.1878 10.212V14.812L15.0118 17.62C15.6058 17.956 15.9998 18.584 15.9998 19.268V23.052C15.9998 23.778 15.1798 24.182 14.5378 23.81L9.45983 20.864C8.86583 20.528 8.47183 19.898 8.47183 19.216V12.788C8.47183 12.104 8.86583 11.476 9.45983 11.138L14.5378 8.19199C15.1798 7.81999 15.9998 8.22199 15.9998 8.94999V13.188L13.5258 14.614C12.8018 15.032 12.4778 15.834 12.7378 16.562C12.9978 17.288 13.7998 17.614 14.5258 17.196L19.2018 14.586C19.8438 14.214 20.2118 13.562 20.2118 12.844V8.94999C20.2118 8.22199 21.0318 7.81999 21.6738 8.19199L22.7518 8.77999C23.3458 9.11599 23.7398 9.74599 23.7398 10.428V19.216C23.7398 20.704 22.6538 21.984 21.2018 22.376L16.5258 23.656C16.3298 23.708 16.1578 23.734 15.9998 23.734C15.4118 23.734 14.8558 23.422 14.5858 22.904L13.0498 20.124C12.9138 19.876 12.6338 19.734 12.3478 19.792C12.0618 19.852 11.8558 20.104 11.8558 20.394V22.012C11.8558 22.738 12.6758 23.142 13.3178 22.77L18.3958 19.822C18.9898 19.486 19.3838 18.856 19.3838 18.172V14.522L21.4738 13.33C22.1978 12.912 22.5218 12.11 22.2618 11.382C22.0018 10.654 21.2018 10.33 20.4758 10.746L13.9858 14.522L11.7978 9.28999Z" />
          </svg>
          <h2 className="font-heading-display mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Portal Sign-In
          </h2>
        </div>
        {displayReason && (
          <div className="flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            <AlertTriangle size={20} />
            <p>{displayReason}</p>
          </div>
        )}
        <form
          onSubmit={handleLogin}
          className="bg-dark-bg-secondary border-dark-bg-tertiary mt-8 space-y-6 rounded-xl border p-6 shadow-2xl sm:p-8"
        >
          <div>
            <label htmlFor="email-address" className="text-dark-text-secondary mb-1 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input-light bg-dark-bg-tertiary border-dark-bg-tertiary/50 text-dark-text-primary focus:border-brand-purple-500 h-11"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-dark-text-secondary mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input-light bg-dark-bg-tertiary border-dark-bg-tertiary/50 text-dark-text-primary focus:border-brand-purple-500 h-11"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertTriangle size={16} /> {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className={`btn-cta-dark w-full justify-center px-4 py-3 text-base ${isSubmitting || authLoading ? 'cursor-wait opacity-70' : ''}`}
            >
              {isSubmitting || authLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn size={20} className="mr-2" />
              )}
              Sign In
            </button>
          </div>
        </form>
        <p className="text-dark-text-tertiary text-center text-xs">
          Forgot your password? Please contact the super administrator.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPageContent;
