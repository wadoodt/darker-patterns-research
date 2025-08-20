import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';

import type { AppUser } from '@/types/user';

interface UserProfileAvatarProps {
  user: AppUser;
}

export default function UserProfileAvatar({ user }: UserProfileAvatarProps) {
  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <>
      <Avatar className="admin-sidebar-user-avatar h-7 w-7 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium">{user.displayName || 'User'}</span>
        <span className="text-muted-foreground truncate text-xs">{user.email}</span>
        {user?.roles && user.roles.length > 0 && <p className="admin-sidebar-user-role">{user.roles.join(', ')}</p>}
      </div>
      <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
    </>
  );
}
