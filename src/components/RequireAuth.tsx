// src/components/RequireAuth.tsx
// Wraps any route that needs authentication.
// Checks Supabase session — redirects to /admin/login if not signed in.
//
// Usage in App.tsx:
//   <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />

import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession, onAuthChange, type AdminSession } from '@/lib/supabase';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);

  useEffect(() => {
    // Initial check
    getSession().then(setSession);

    // Keep in sync if token expires or user logs out in another tab
    const unsubscribe = onAuthChange(setSession);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // undefined = still loading, null = definitely not logged in
    if (session === null) {
      navigate('/admin/login', {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [session, navigate, location]);

  // Loading state
  if (session === undefined) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Urbanist, system-ui, sans-serif',
          color: 'rgba(255,255,255,0.15)',
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
        }}
      >
        LOADING
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
