'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProtectedRouteProps } from './ProtectedRoute.types';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, loading, isResearcher, isAdmin } = useAuth();
  const router = useRouter();

  const userHasRequiredRole =
    !allowedRoles || allowedRoles.length === 0
      ? true
      : allowedRoles.some((role) => {
          if (role === 'admin') return isAdmin;
          if (role === 'researcher') return isResearcher;
          return false;
        });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=' + window.location.pathname);
      } else if (!userHasRequiredRole) {
        router.push('/'); // Or a specific "access denied" page
      }
    }
  }, [user, loading, userHasRequiredRole, router]);

  if (loading || !user || !userHasRequiredRole) {
    // Show a loader or a minimal UI while checking auth / redirecting
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="bg-card w-full max-w-md space-y-4 rounded-lg p-8 shadow-xl">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="mt-4 h-10 w-1/2" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
