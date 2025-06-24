// components/admin/AdminSidebar.tsx
'use client';
import UserProfileButton from '@/components/auth/UserProfileButton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, FileText, Home, ListChecks, Palette, ShieldCheck, UserCircle } from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Removed useRouter as it's not used for navigation here

const AdminSidebar = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', tooltip: 'Dashboard', icon: Home, adminOnly: false },
    { href: '/admin/entries', label: 'DPO Entries', icon: ListChecks, adminOnly: false },
    {
      href: '/admin/statistics',
      label: 'Survey Statistics',
      tooltip: 'Survey Statistics',
      icon: BarChart3,
      adminOnly: false,
    },
    { href: '/admin/submissions', label: 'Submissions', tooltip: 'Submissions', icon: FileText, adminOnly: false },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="admin-sidebar">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="admin-sidebar-logo-container">
          <Palette className="admin-sidebar-logo-icon" /> {/* Using Palette Icon */}
          <h1 className="admin-sidebar-logo-text">Validator</h1> {/* Updated to Validator */}
        </Link>
        <p className="admin-sidebar-version">v0.1.0 Admin</p> {/* Updated to Admin */}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2 backdrop-blur-sm">
        <SidebarMenu>
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href} className={`admin-sidebar-navlink ${isActive ? 'active' : ''}`}>
                <SidebarMenuButton asChild tooltip={item.tooltip}>
                  <Link href={item.href}>
                    <item.icon strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t p-2 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfileButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
export default AdminSidebar;
