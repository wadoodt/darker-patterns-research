import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';

interface UserProfile {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  roles?: string[];
}

interface UserProfileAvatarProps {
  profile: UserProfile;
}

export default function UserProfileAvatar({ profile }: UserProfileAvatarProps) {
  const initials = profile.displayName
    ? profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : profile.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <>
      <Avatar className="admin-sidebar-user-avatar h-7 w-7 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
        <AvatarImage src={profile.photoURL || undefined} alt={profile.displayName || 'User Avatar'} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium">{profile.displayName || 'User'}</span>
        <span className="text-muted-foreground truncate text-xs">{profile.email}</span>
        {profile?.roles && profile.roles.length > 0 && (
          <p className="admin-sidebar-user-role">{profile.roles.join(', ')}</p>
        )}
      </div>
      <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
    </>
  );
}
