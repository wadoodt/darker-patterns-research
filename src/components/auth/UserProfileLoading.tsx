import { SidebarMenuButton } from '@/components/ui/sidebar';
import { UserCircle } from 'lucide-react';

export default function UserProfileLoading() {
  return (
    <SidebarMenuButton className="w-full justify-start" disabled>
      <div className="admin-sidebar-user-avatar">
        <UserCircle size={24} />
      </div>
      <span className="truncate group-data-[collapsible=icon]:hidden">Loading...</span>
    </SidebarMenuButton>
  );
}
