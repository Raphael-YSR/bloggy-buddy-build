// src/pages/AdminPostEditor.tsx
// ---------------------------------------------------------
// Route: /admin/new  →  create new post
// Route: /admin/edit/:id  →  edit existing post
//
// Add to your App.tsx routes:
//   <Route path="/admin/new" element={<AdminPostEditor />} />
//   <Route path="/admin/edit/:id" element={<AdminPostEditor />} />
//   <Route path="/admin" element={<AdminDashboard />} />
// ---------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createPost,
  updatePost,
  getCategories,
  getTags,
  getAuthors,
  createTag,
  generateSlug,
  estimateReadTime,
  supabase,
  type Category,
  type Tag,
  type Author,
  type Post,
  type CreatePostInput,
} from '@/lib/supabase';

// ---- Minimal inline styles to avoid shadcn dependency issues ----
const S = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    fontFamily: 'Urbanist, system-ui, sans-serif',
    padding: '0',
  } as React.CSSProperties,
  topBar: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 2rem',
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
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.4)',
  },
  topActions: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  btnGhost: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.6)',
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  } as React.CSSProperties,
  btnPrimary: {
    background: '#fff',
    border: 'none',
    color: '#000',
    padding: '0.45rem 1.4rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 700,
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  } as React.CSSProperties,
  btnDanger: {
    background: 'none',
    border: '1px solid rgba(220,50,50,0.4)',
    color: '#ff6b6b',
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '0',
    maxWidth: '100%',
    minHeight: 'calc(100vh - 56px)',
  } as React.CSSProperties,
  main: {
    padding: '3rem 4rem',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  } as React.CSSProperties,
  sidebar: {
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    background: '#050505',
  },
  titleInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '2.4rem',
    fontWeight: 800,
    fontFamily: 'Urbanist, system-ui, sans-serif',
    width: '100%',
    lineHeight: 1.2,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
    caretColor: '#fff',
  } as React.CSSProperties,
  slugRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  slugPrefix: { color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' },
  slugInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    flexGrow: 1,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '2px',
  } as React.CSSProperties,
  excerptInput: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1rem',
    fontFamily: 'Urbanist, system-ui, sans-serif',
    width: '100%',
    padding: '0.9rem 1rem',
    resize: 'vertical' as const,
    outline: 'none',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  } as React.CSSProperties,
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    margin: '1rem 0',
  },
  label: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.5rem',
  },
  select: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#fff',
    padding: '0.55rem 0.75rem',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#fff',
    padding: '0.55rem 0.75rem',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    width: '100%',
    outline: 'none',
  } as React.CSSProperties,
  tagsWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: '0.4rem', marginBottom: '0.5rem' },
  tag: {
    padding: '0.2rem 0.65rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.1s',
    userSelect: 'none' as const,
  },
  tagActive: { background: '#fff', color: '#000', border: '1px solid #fff' },
  tagInactive: { background: 'transparent', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.15)' },
  newTagRow: { display: 'flex', gap: '0.4rem', marginTop: '0.5rem' },
  markdownWrap: {
    position: 'relative' as const,
    minHeight: '500px',
  },
  markdownHint: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.2)',
    marginBottom: '0.75rem',
    letterSpacing: '0.04em',
  },
  bodyTextarea: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '1.05rem',
    fontFamily: 'ui-monospace, monospace',
    width: '100%',
    minHeight: '520px',
    resize: 'vertical' as const,
    lineHeight: 1.8,
    caretColor: '#fff',
    padding: 0,
  } as React.CSSProperties,
  statusBadge: (status: string) => ({
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    background: status === 'published' ? 'rgba(50,200,100,0.15)' : 'rgba(255,255,255,0.07)',
    color: status === 'published' ? '#4ade80' : 'rgba(255,255,255,0.4)',
    border: status === 'published' ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.1)',
  } as React.CSSProperties),
  sideSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  coverPreview: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover' as const,
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.08)',
    marginTop: '0.5rem',
  },
  stat: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.78rem',
  },
  toast: {
    position: 'fixed' as const,
    bottom: '2rem',
    right: '2rem',
    background: '#111',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    zIndex: 999,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  },
};

// ---------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------
export default function AdminPostEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [publishedAt, setPublishedAt] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Data
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [slugManual, setSlugManual] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Load reference data
  useEffect(() => {
    Promise.all([getAuthors(), getCategories(), getTags()]).then(([a, c, t]) => {
      setAuthors(a);
      setCategories(c);
      setTags(t);
      if (a.length) setAuthorId(a[0].id);
    });
  }, []);

  // Load existing post if editing
  useEffect(() => {
    if (!id) return;
    supabase
      .from('posts')
      .select(`*, post_tags(tag_id)`)
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const p = data as any;
        setTitle(p.title ?? '');
        setSlug(p.slug ?? '');
        setExcerpt(p.excerpt ?? '');
        setBody(p.body ?? '');
        setCoverImageUrl(p.cover_image_url ?? '');
        setStatus(p.status ?? 'draft');
        setPublishedAt(p.published_at ? p.published_at.slice(0, 16) : '');
        setAuthorId(p.author_id ?? '');
        setCategoryId(p.category_id ?? '');
        setMetaTitle(p.meta_title ?? '');
        setMetaDescription(p.meta_description ?? '');
        setSelectedTagIds((p.post_tags ?? []).map((pt: any) => pt.tag_id));
        setSlugManual(true);
      });
  }, [id]);

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await createTag(newTagName.trim());
      setTags((prev) => [...prev, tag]);
      setSelectedTagIds((prev) => [...prev, tag.id]);
      setNewTagName('');
    } catch (e: any) {
      showToast('Tag already exists or error creating tag');
    }
  };

  const handleSave = async (saveStatus?: 'draft' | 'published') => {
    if (!title.trim() || !body.trim()) {
      showToast('Title and body are required');
      return;
    }
    setSaving(true);
    try {
      const finalStatus = saveStatus ?? status;
      const input: CreatePostInput = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        excerpt: excerpt.trim() || undefined,
        body: body.trim(),
        cover_image_url: coverImageUrl.trim() || undefined,
        read_time_minutes: estimateReadTime(body),
        status: finalStatus,
        published_at: finalStatus === 'published'
          ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString())
          : undefined,
        author_id: authorId || undefined,
        category_id: categoryId || undefined,
        meta_title: metaTitle.trim() || undefined,
        meta_description: metaDescription.trim() || undefined,
        tag_ids: selectedTagIds,
      };

      if (isEditing && id) {
        await updatePost(id, input);
        showToast(finalStatus === 'published' ? '✓ Post published' : '✓ Draft saved');
      } else {
        const post = await createPost(input);
        showToast(finalStatus === 'published' ? '✓ Post published' : '✓ Draft saved');
        navigate(`/admin/edit/${post.id}`, { replace: true });
      }
      setStatus(finalStatus);
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await supabase.from('posts').delete().eq('id', id);
      navigate('/admin');
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    }
  };

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const readTime = estimateReadTime(body);

  return (
    <div style={S.page}>
      {/* Top Bar */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button style={S.btnGhost} onClick={() => navigate('/admin')}>
            ← Admin
          </button>
          <span style={S.logo}>
            {isEditing ? 'Edit Post' : 'New Post'}
          </span>
          <span style={S.statusBadge(status)}>{status}</span>
        </div>
        <div style={S.topActions}>
          <span style={S.stat}>{wordCount} words · {readTime} min read</span>
          {isEditing && (
            <button style={S.btnDanger} onClick={handleDelete}>
              Delete
            </button>
          )}
          <button
            style={S.btnGhost}
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }}
            onClick={() => handleSave('published')}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={S.layout}>
        {/* Main Editor */}
        <div style={S.main}>
          <textarea
            style={S.titleInput}
            placeholder="Post title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
          />

          <div style={S.slugRow}>
            <span style={S.slugPrefix}>/blog/</span>
            <input
              style={S.slugInput}
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="auto-generated-slug"
            />
          </div>

          <textarea
            style={S.excerptInput}
            placeholder="Short excerpt / subtitle shown on the blog grid…"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
          />

          <hr style={S.divider} />

          <div style={S.markdownWrap}>
            <p style={S.markdownHint}>
              MARKDOWN BODY — Use # H1, ## H2, **bold**, *italic*, `code`, &gt; blockquote
            </p>
            <textarea
              style={S.bodyTextarea}
              placeholder={`## Introduction\n\nStart writing your post here...\n\nUse **bold**, *italic*, and \`code\` for formatting.\n\n## Section Two\n\nYour content continues.`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={S.sidebar}>
          {/* Status */}
          <div style={S.sideSection}>
            <label style={S.label}>Status</label>
            <select
              style={S.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Publish Date */}
          <div style={S.sideSection}>
            <label style={S.label}>Publish Date</label>
            <input
              style={S.input}
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>

          <hr style={S.divider} />

          {/* Author */}
          <div style={S.sideSection}>
            <label style={S.label}>Author</label>
            <select
              style={S.select}
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
            >
              <option value="">— None —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div style={S.sideSection}>
            <label style={S.label}>Category</label>
            <select
              style={S.select}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <hr style={S.divider} />

          {/* Tags */}
          <div style={S.sideSection}>
            <label style={S.label}>Tags</label>
            <div style={S.tagsWrap}>
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    ...S.tag,
                    ...(selectedTagIds.includes(tag.id) ? S.tagActive : S.tagInactive),
                  }}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div style={S.newTagRow}>
              <input
                style={{ ...S.input, flexGrow: 1 }}
                placeholder="New tag…"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button style={S.btnGhost} onClick={handleAddTag}>+</button>
            </div>
          </div>

          <hr style={S.divider} />

          {/* Cover Image */}
          <div style={S.sideSection}>
            <label style={S.label}>Cover Image URL</label>
            <input
              style={S.input}
              placeholder="https://..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
            {coverImageUrl && (
              <img src={coverImageUrl} alt="Cover preview" style={S.coverPreview} />
            )}
          </div>

          <hr style={S.divider} />

          {/* SEO */}
          <div style={S.sideSection}>
            <label style={S.label}>SEO Title</label>
            <input
              style={S.input}
              placeholder="Defaults to post title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div style={S.sideSection}>
            <label style={S.label}>SEO Description</label>
            <textarea
              style={{ ...S.input, resize: 'vertical', minHeight: '70px', lineHeight: 1.5 }}
              placeholder="Defaults to excerpt"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}
