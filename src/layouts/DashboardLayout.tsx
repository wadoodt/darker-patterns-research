import { Outlet, Link } from 'react-router-dom';
import Header from '@components/Header';

export default function DashboardLayout() {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <aside style={{ padding: '1rem', borderRight: '1px solid #eee', width: '200px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4>Dashboard</h4>
            <Link to="/dashboard">Home</Link>
            <Link to="/dashboard/settings">Settings</Link>
            <Link to="/dashboard/team">Team</Link>
            <Link to="/dashboard/billing">Billing</Link>
            <Link to="/dashboard/infra">Infra</Link>
            <Link to="/dashboard/domains">Domains</Link>
            <hr style={{ margin: '1rem 0' }} />
            <h4>Admin Panel</h4>
            <Link to="/admin-panel">Admin Home</Link>
            <Link to="/admin-panel/settings">Admin Settings</Link>
            <Link to="/admin-panel/users">Users</Link>
            <Link to="/admin-panel/companies">Companies</Link>
            <Link to="/admin-panel/infra">Admin Infra</Link>
          </nav>
        </aside>
        <main style={{ padding: '1rem', flexGrow: 1 }}><Outlet /></main>
      </div>
    </div>
  );
}

