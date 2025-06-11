// app/(admin)/layout.tsx
'use client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, isResearcher, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading) {
      if (pathname === '/admin/login') {
        if (user && (isResearcher || isAdmin)) {
          router.replace('/admin/overview');
        }
        return;
      }

      if (!user) {
        router.replace('/admin/login?reason=unauthenticated');
      } else if (!(isResearcher || isAdmin)) {
        router.replace('/admin/login?reason=unauthorized');
      }
    }
  }, [user, authLoading, isResearcher, isAdmin, router, pathname]);

  if (authLoading || (pathname === '/admin/login' && user && (isResearcher || isAdmin))) {
    return (
      <div className="bg-dark-bg-primary text-dark-text-primary flex min-h-screen items-center justify-center">
        <Loader2 className="text-brand-purple-400 h-8 w-8 animate-spin" />
        <span className="ml-3">Loading Dashboard...</span>
      </div>
    );
  }

  if (pathname !== '/admin/login' && (!user || !(isResearcher || isAdmin))) {
    return (
      <div className="bg-dark-bg-primary text-dark-text-primary flex min-h-screen items-center justify-center">
        <Loader2 className="text-brand-purple-400 h-8 w-8 animate-spin" />
        <span className="ml-3">Verifying Access...</span>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="bg-dark-bg-primary text-dark-text-primary flex min-h-screen">
      {' '}
      {/* Removed theme-dark-admin */}
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <main className="p-6">
          {' '}
          {/* Added padding to main content area */}
          {children}
        </main>
      </div>
    </div>
  );
}
