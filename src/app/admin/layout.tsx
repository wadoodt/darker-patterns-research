import type { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, BarChart3, Settings, FileText, UserCircle, ShieldCheck, Palette } from 'lucide-react';
import UserProfileButton from '@/components/auth/UserProfileButton';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireResearcher={true}>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen">
          <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader className="p-4">
              <Link href="/admin" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <Palette className="text-primary h-8 w-8 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
                <h1 className="font-headline text-primary text-2xl font-semibold group-data-[collapsible=icon]:hidden">
                  Validator
                </h1>
              </Link>
            </SidebarHeader>
            <SidebarContent className="flex-grow p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/admin">
                      <Home />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Analytics">
                    <Link href="/admin/analytics">
                      <BarChart3 />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Submissions">
                    <Link href="/admin/submissions">
                      <FileText />
                      <span>Submissions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="User Management">
                    <Link href="/admin/users">
                      <UserCircle />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Pattern Definitions">
                    <Link href="/admin/patterns">
                      <ShieldCheck />
                      <span>Patterns</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-sidebar-border border-t p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/admin/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <UserProfileButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
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
