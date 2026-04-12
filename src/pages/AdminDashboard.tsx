// src/pages/AdminDashboard.tsx
// Route: /admin
// Lists all posts (drafts + published) with quick actions

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPostsAdmin, deletePost, signOut, type PostAdmin } from '@/lib/supabase';

// Alias for component use
type Post = PostAdmin;

const S = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    fontFamily: 'Urbanist, system-ui, sans-serif',
  } as React.CSSProperties,
  topBar: {
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '0 2.5rem',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky' as const,
    top: 0,
    background: '#000',
    zIndex: 50,
  },
  logo: {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.35)',
  },
  btnPrimary: {
    background: '#fff',
    border: 'none',
    color: '#000',
    padding: '0.45rem 1.3rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 700,
    fontFamily: 'inherit',
  } as React.CSSProperties,
  btnGhost: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.55)',
    padding: '0.35rem 0.9rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  btnDanger: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,80,80,0.6)',
    padding: '0.35rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  body: { padding: '2.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  subtext: { color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginBottom: '2rem' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filterBtn: (active: boolean) => ({
    background: active ? '#fff' : 'none',
    color: active ? '#000' : 'rgba(255,255,255,0.4)',
    border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
    padding: '0.3rem 0.9rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: active ? 700 : 400,
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  } as React.CSSProperties),
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: {
    textAlign: 'left' as const,
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.25)',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.1s',
  },
  td: {
    padding: '1rem 0.75rem 1rem 0',
    fontSize: '0.88rem',
    verticalAlign: 'middle' as const,
  },
  titleCell: {
    fontWeight: 600,
    color: '#fff',
    maxWidth: '340px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
  },
  statusPill: (status: string) => ({
    padding: '0.15rem 0.55rem',
    borderRadius: '20px',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    background: status === 'published'
      ? 'rgba(74,222,128,0.12)'
      : status === 'draft'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(255,180,50,0.1)',
    color: status === 'published' ? '#4ade80' : status === 'draft' ? 'rgba(255,255,255,0.4)' : '#fbbf24',
  } as React.CSSProperties),
  empty: {
    textAlign: 'center' as const,
    padding: '5rem 2rem',
    color: 'rgba(255,255,255,0.2)',
  },
  toast: {
    position: 'fixed' as const,
    bottom: '2rem',
    right: '2rem',
    background: '#111',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    zIndex: 999,
  },
};

type FilterStatus = 'all' | 'published' | 'draft' | 'archived';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
    archived: posts.filter((p) => p.status === 'archived').length,
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      showToast('Post deleted');
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={S.page}>
      <div style={S.topBar}>
        <span style={S.logo}>RG · Admin</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button style={S.btnGhost} onClick={() => navigate("/")}>← Blog</button>
          <button style={S.btnGhost} onClick={async () => { await signOut(); navigate("/admin/login", { replace: true }); }}>Sign out</button>
          <button style={S.btnPrimary} onClick={() => navigate('/admin/new')}>
            + New Post
          </button>
        </div>
      </div>

      <div style={S.body}>
        <h1 style={S.heading}>Posts</h1>
        <p style={S.subtext}>{counts.published} published · {counts.draft} drafts</p>

        {/* Filter tabs */}
        <div style={S.filters}>
          {(['all', 'published', 'draft', 'archived'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              style={S.filterBtn(filter === f)}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={S.empty}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</p>
            <p>No posts yet. <button style={{ ...S.btnPrimary, display: 'inline-block' }} onClick={() => navigate('/admin/new')}>Write your first post</button></p>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Title</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Published</th>
                <th style={S.th}>Read Time</th>
                <th style={S.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} style={S.tr}>
                  <td style={{ ...S.td, ...S.titleCell }} onClick={() => navigate(`/admin/edit/${post.id}`)}>
                    {post.title}
                  </td>
                  <td style={S.td}>
                    <span style={S.statusPill(post.status)}>{post.status}</span>
                  </td>
                  <td style={{ ...S.td, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    {(post as any).categories?.name ?? '—'}
                  </td>
                  <td style={{ ...S.td, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
                    {formatDate(post.published_at)}
                  </td>
                  <td style={{ ...S.td, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
                    {post.read_time_minutes ? `${post.read_time_minutes} min` : '—'}
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button style={S.btnGhost} onClick={() => navigate(`/admin/edit/${post.id}`)}>Edit</button>
                      <button style={S.btnDanger} onClick={() => handleDelete(post)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}
