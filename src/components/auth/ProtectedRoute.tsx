'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProtectedRouteProps } from './ProtectedRoute.types';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireResearcher = false }) => {
  const { user, loading, isResearcher } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=' + window.location.pathname);
      } else if (requireResearcher && !isResearcher) {
        router.push('/'); // Or a specific "access denied" page
      }
    }
  }, [user, loading, isResearcher, router, requireResearcher]);

  if (loading || !user || (requireResearcher && !isResearcher && user)) {
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
