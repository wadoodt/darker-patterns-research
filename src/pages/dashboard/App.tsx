import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import DashboardLayout from '@layouts/DashboardLayout';
import ProtectedRoute from '@components/ProtectedRoute';
import SettingsPage from './SettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/settings" element={<ProtectedRoute roles={['super-admin']}><SettingsPage /></ProtectedRoute>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

