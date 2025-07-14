
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>Welcome, {user?.username || 'User'}!</h1>
      <p>This is your protected dashboard.</p>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <br />
      <img src="/images/dashboard_placeholder.png" alt="Dashboard Placeholder" style={{ width: '300px', height: '300px' }} />
    </div>
  );
}

