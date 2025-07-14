import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
          <a href="/recover-password">Recover Password</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>{children}</main>
      <footer style={{ padding: '1rem', borderTop: '1px solid #eee', marginTop: 'auto' }}>
        Public Footer
      </footer>
    </div>
  );
}

