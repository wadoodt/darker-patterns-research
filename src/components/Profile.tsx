// src/components/Profile.tsx
'use client';

import { useState } from 'react';
import { useAsyncCache } from '@hooks/useAsyncCache';
import { useCache } from '@contexts/CacheContext';
import { CacheLevel } from '@lib/cache/types';
import type { Profile as ProfileType } from 'types/api';

// Fetcher for getting the profile
async function fetchProfile() {
  const response = await fetch('/api/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
}

// Fetcher for updating the profile
async function updateProfile(newName: string) {
  const response = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName }),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
}

export function Profile() {
  const { invalidateByPattern } = useCache();
  const {
    data: profile,
    loading,
    error,
    refresh,
  } = useAsyncCache<ProfileType>(
    ['user-profile', 'current'], // Hierarchical cache key
    fetchProfile,
    CacheLevel.PERSISTENT // Cache for a day
  );

  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setIsUpdating(true);
    try {
      await updateProfile(newName);
      // Invalidate the user profile cache to force a refetch
      await invalidateByPattern('async-data:user-profile*');
      // Explicitly refresh the data to update the UI
      await refresh();
      setNewName('');
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && !profile) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '1.125rem', fontWeight: '600' }}>User Profile</h3>
      {profile && (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          style={{ padding: '8px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleUpdateProfile} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Name'}
        </button>
      </div>
    </div>
  );
}
