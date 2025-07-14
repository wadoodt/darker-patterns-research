
import { useAuth } from '@hooks/useAuth';
import { CacheAdminPanel } from '@components/CacheAdminPanel';
import { CompaniesList } from '@components/CompaniesList';
import { Profile } from '@components/Profile';

export default function DashboardPage() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Welcome, {user?.username || 'User'}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>This is your protected dashboard. Below are the components demonstrating client-side caching.</p>
      
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <Profile />
        <CompaniesList />
        <CacheAdminPanel />
      </div>
    </div>
  );
}

