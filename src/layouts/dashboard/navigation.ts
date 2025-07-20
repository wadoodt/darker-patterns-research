import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  Ticket,
  Building,
  Shield,
} from 'lucide-react';

// Dashboard Pages
import DashboardHomePage from "@features/dashboard/pages/DashboardHomePage";
import TeamPage from "@features/dashboard/pages/TeamPage";
import BillingPage from "@features/dashboard/pages/BillingPage";
import SettingsPage from "@features/dashboard/pages/SettingsPage";
import SupportPage from '@features/dashboard/pages/SupportPage';

// Admin Panel Pages
import AdminPanelPage from "@features/admin-panel/pages/AdminPanelPage";
import AdminPanelUsersPage from "@features/admin-panel/pages/UsersPage";
import TicketsPage from '@features/admin-panel/pages/TicketsPage';
import AdminPanelCompaniesPage from "@features/admin-panel/pages/CompaniesPage";
import AdminPanelSettingsPage from "@features/admin-panel/pages/SettingsPage";
import AdminPanelInfraPage from "@features/admin-panel/pages/InfraPage";

export interface NavigationItem {
  name: string;
  path: string;
  href: string;
  icon: React.ElementType;
  component: React.ComponentType;
  current?: boolean;
  roles?: string[];
}

export const dashboardNavigation: NavigationItem[] = [
  { name: 'sidebar.dashboard.home', path: '/dashboard', href: '/dashboard', icon: LayoutDashboard, component: DashboardHomePage, roles: ['admin', 'super-admin', 'qa'] },
  { name: 'sidebar.dashboard.team', path: '/dashboard/team', href: '/dashboard/team', icon: Users, component: TeamPage, roles: ['admin', 'super-admin', 'qa'] },
  { name: 'sidebar.dashboard.billing', path: '/dashboard/billing', href: '/dashboard/billing', icon: CreditCard, component: BillingPage, roles: ['admin', 'super-admin', 'qa'] },
  { name: 'sidebar.dashboard.settings', path: '/dashboard/settings', href: '/dashboard/settings', icon: Settings, component: SettingsPage, roles: ['user', 'admin', 'super-admin', 'qa'] },
  { name: 'sidebar.dashboard.support', path: '/dashboard/support', href: '/dashboard/support', icon: HelpCircle, component: SupportPage, roles: ['user', 'admin', 'super-admin', 'qa'] },
];

export const adminNavigation: NavigationItem[] = [
  { name: 'sidebar.admin.home', path: '/admin-panel', href: '/admin-panel', icon: LayoutDashboard, component: AdminPanelPage, roles: ['super-admin', 'qa'] },
  { name: 'sidebar.admin.users', path: '/admin-panel/users', href: '/admin-panel/users', icon: Users, component: AdminPanelUsersPage, roles: ['super-admin', 'qa'] },
  { name: 'sidebar.admin.tickets', path: '/admin-panel/tickets', href: '/admin-panel/tickets', icon: Ticket, component: TicketsPage, roles: ['super-admin', 'qa'] },
  { name: 'sidebar.admin.companies', path: '/admin-panel/companies', href: '/admin-panel/companies', icon: Building, component: AdminPanelCompaniesPage, roles: ['super-admin', 'qa'] },
  { name: 'sidebar.admin.config', path: '/admin-panel/config', href: '/admin-panel/config', icon: Shield, component: AdminPanelSettingsPage, roles: ['super-admin', 'qa'] },
  { name: 'sidebar.admin.infra', path: '/admin-panel/infra', href: '/admin-panel/infra', icon: Settings, component: AdminPanelInfraPage, roles: ['super-admin', 'qa'] },
];
