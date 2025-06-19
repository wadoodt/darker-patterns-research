import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import Link from 'next/link';

import type { AppUser } from '@/types/user';

interface UserProfileDropdownProps {
  user: AppUser;
  handleLogout: () => void;
}

export default function UserProfileDropdown({ user, handleLogout }: UserProfileDropdownProps) {
  return (
    <DropdownMenuContent
      className="w-56 bg-[color:var(--color-dark-bg-secondary)]"
      align="end"
      side="top"
      sideOffset={10}
    >
      <DropdownMenuItem asChild>
        <Link href="/profile" className="admin-sidebar-navlink">
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </Link>
      </DropdownMenuItem>
      {user?.roles?.includes('admin') && (
        <DropdownMenuItem asChild>
          <Link href="/admin/settings" className="admin-sidebar-navlink">
            <Settings className="mr-2 h-4 w-4" />
            <span>Project Settings</span>
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="admin-sidebar-logout-button">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
