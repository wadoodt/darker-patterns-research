'use client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'researcher']}>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-6 shadow-sm backdrop-blur-sm">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">{/* Breadcrumbs or Page Title can go here */}</div>
              {/* Additional header content e.g. search, notifications */}
            </header>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
