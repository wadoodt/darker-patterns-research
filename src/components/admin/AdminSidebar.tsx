// components/admin/AdminSidebar.tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, LayoutDashboard, ListChecks, LogOut, Palette, Settings, UserCircle } from 'lucide-react'; // Palette for logo
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Removed useRouter as it's not used for navigation here
import { toast } from 'sonner';

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, profile, logout, loading: authLoading, isAdmin } = useAuth();

  const navItems = [
    { href: '/overview', label: 'Project Overview', icon: LayoutDashboard, adminOnly: false },
    { href: '/entries', label: 'DPO Entries', icon: ListChecks, adminOnly: false }, // Updated label
    { href: '/statistics', label: 'Survey Statistics', icon: BarChart3, adminOnly: false }, // Updated label
    // Add other nav items like Pattern Definitions, User Management here later
    { href: '/settings', label: 'Project Settings', icon: Settings, adminOnly: true },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      // Redirection is handled by AdminDashboardLayout's useEffect based on user state
    } catch (error) {
      console.error('Sidebar logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link href="/overview" className="admin-sidebar-logo-container">
          <Palette className="admin-sidebar-logo-icon" /> {/* Using Palette Icon */}
          <h1 className="admin-sidebar-logo-text">Validator</h1> {/* Updated to Validator */}
        </Link>
        <p className="admin-sidebar-version">v0.1.0 Admin</p> {/* Updated to Admin */}
      </div>

      {!authLoading && user && (
        <div className="admin-sidebar-user-info-container">
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-avatar">
              <UserCircle size={24} />
            </div>
            <div className="admin-sidebar-user-details">
              <p className="admin-sidebar-user-greeting">Signed in as</p>
              <p className="admin-sidebar-user-name" title={user.email || ''}>
                {profile?.displayName || user.displayName || user.email}
              </p>
              {profile?.roles && profile.roles.length > 0 && (
                <p className="admin-sidebar-user-role">{profile.roles.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          const isActive = item.href === '/overview' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href} className={`admin-sidebar-navlink ${isActive ? 'active' : ''}`}>
              <item.icon className="admin-sidebar-navlink-icon" strokeWidth={isActive ? 2.5 : 2} />
              <p className="admin-sidebar-navlink-text">{item.label}</p>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-logout-container">
        <button onClick={handleLogout} className="admin-sidebar-logout-button">
          <LogOut className="admin-sidebar-navlink-icon" />
          <p className="admin-sidebar-navlink-text">Logout</p>
        </button>
      </div>
    </aside>
  );
};
export default AdminSidebar;
