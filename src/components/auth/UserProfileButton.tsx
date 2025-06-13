'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { Auth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserProfileAvatar from './UserProfileAvatar';
import UserProfileDropdown from './UserProfileDropdown';
import UserProfileLoading from './UserProfileLoading';

export default function UserProfileButton() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth as Auth);
      toast.success('Logged out successfully.');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  if (loading || !profile) {
    return <UserProfileLoading />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="admin-sidebar-user-info group/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex h-auto w-full items-center justify-start gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding] outline-none group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 focus-visible:ring-2"
        >
          <UserProfileAvatar profile={profile} />
        </Button>
      </DropdownMenuTrigger>
      <UserProfileDropdown profile={profile} handleLogout={handleLogout} />
    </DropdownMenu>
  );
}
