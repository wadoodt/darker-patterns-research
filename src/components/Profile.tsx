// src/components/Profile.tsx
'use client';

import { useAuth } from '@contexts/AuthContext';

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '1.125rem', fontWeight: '600' }}>User Profile</h3>
      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}
