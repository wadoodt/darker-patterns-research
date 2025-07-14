import { Outlet } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

export default function DashboardLayout() {
  const { logout } = useAuth();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
    window.location.href = '/login'; // Force a full page reload to the login page
  };

  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Dashboard</span>
        <nav>
          <a href="/login" onClick={handleLogout}>Logout</a>
        </nav>
      </header>
      <div style={{ display: 'flex' }}>
        <aside style={{ padding: '1rem', borderRight: '1px solid #eee' }}>Sidebar Placeholder</aside>
        <main style={{ padding: '1rem', flexGrow: 1 }}><Outlet /></main>
      </div>
    </div>
  );
}

