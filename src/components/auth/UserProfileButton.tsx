'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserProfileAvatar from './UserProfileAvatar';
import UserProfileDropdown from './UserProfileDropdown';
import UserProfileLoading from './UserProfileLoading';

export default function UserProfileButton() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  if (loading || !user) {
    return <UserProfileLoading />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="admin-sidebar-user-info group/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex h-auto w-full items-center justify-start gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding] outline-none group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 focus-visible:ring-2"
        >
          <UserProfileAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <UserProfileDropdown user={user} handleLogout={handleLogout} />
    </DropdownMenu>
  );
}
