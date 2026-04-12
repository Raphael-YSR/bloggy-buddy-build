// src/pages/AdminLogin.tsx
// Route: /admin/login
// Uses Supabase Auth — no bcrypt, no custom password storage.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getSession } from '@/lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    getSession().then((session) => {
      if (session) navigate('/admin', { replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={S.page}>
        <span style={S.muted}>Checking session…</span>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoWrap}>
          <div style={S.logoCircle}>
            <span style={S.logoText}>RG</span>
          </div>
          <p style={S.logoLabel}>New Hathaway · Admin</p>
        </div>

        <h1 style={S.heading}>Sign in</h1>
        <p style={S.subtext}>Access the editorial dashboard</p>

        <form onSubmit={handleSubmit} style={S.form}>
          <div style={S.field}>
            <label style={S.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              style={S.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div style={S.field}>
            <label style={S.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              style={S.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p style={S.error}>{error}</p>}

          <button
            type="submit"
            style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={S.footer}>
          Don't have an account? Create one in the{' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            style={S.link}
          >
            Supabase dashboard
          </a>
          {' '}→ Authentication → Users → Add user.
        </p>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Urbanist, system-ui, sans-serif',
    padding: '1.5rem',
  } as React.CSSProperties,
  muted: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.85rem',
  } as React.CSSProperties,
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '3rem 2.5rem',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    background: '#050505',
  } as React.CSSProperties,
  logoWrap: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2.5rem',
  },
  logoCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  logoText: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1rem',
    fontStyle: 'italic',
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  logoLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    margin: 0,
  },
  heading: {
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: '0 0 0.35rem',
    textAlign: 'center' as const,
  },
  subtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.85rem',
    margin: '0 0 2rem',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.45rem',
  },
  label: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '7px',
    color: '#fff',
    padding: '0.7rem 0.9rem',
    fontSize: '0.92rem',
    fontFamily: 'Urbanist, system-ui, sans-serif',
    outline: 'none',
    transition: 'border-color 0.15s',
  } as React.CSSProperties,
  error: {
    color: '#ff6b6b',
    fontSize: '0.82rem',
    margin: 0,
    padding: '0.6rem 0.85rem',
    background: 'rgba(255,80,80,0.07)',
    borderRadius: '6px',
    border: '1px solid rgba(255,80,80,0.15)',
  } as React.CSSProperties,
  btn: {
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '7px',
    padding: '0.78rem',
    fontSize: '0.92rem',
    fontWeight: 700,
    fontFamily: 'Urbanist, system-ui, sans-serif',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.15s',
    letterSpacing: '0.01em',
  } as React.CSSProperties,
  footer: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.75rem',
    textAlign: 'center' as const,
    marginTop: '2rem',
    lineHeight: 1.6,
  } as React.CSSProperties,
  link: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  } as React.CSSProperties,
};
