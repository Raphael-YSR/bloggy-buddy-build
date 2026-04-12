// src/pages/BlogPost.tsx

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getPostBySlug,
  getPublishedPosts,
  type PostDetail,
  type PostSummary,
} from "@/lib/supabase";
import { useDocumentTitle } from "@/hooks/use-document-title";

// ─── Reading Progress Hook ───────────────────────────────────────────────────

function useReadingProgress(
  articleRef: React.RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = articleRef.current;
    if (!el) return;
    const { top, height } = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrolled = Math.max(0, -top);
    const total = Math.max(1, height - windowH);
    setProgress(Math.min(100, (scrolled / total) * 100));
  }, [articleRef]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return progress;
}

// ─── Suggested Posts ─────────────────────────────────────────────────────────

interface SuggestedPostsProps {
  currentSlug: string;
  categoryId: string | null;
}

function SuggestedPosts({ currentSlug, categoryId }: SuggestedPostsProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    getPublishedPosts().then((all) => {
      const others = all.filter((p) => p.slug !== currentSlug);

      // Prefer same category, fall back to latest
      const sameCat = others.filter((p) => p.category_id === categoryId);
      const pool = sameCat.length >= 2 ? sameCat : others;

      // Shuffle and take 3 so it feels curated, not just chronological
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      setPosts(shuffled.slice(0, 3));
    });
  }, [currentSlug, categoryId]);

  if (posts.length === 0) return null;

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <div
      style={{
        marginTop: "5rem",
        paddingTop: "3rem",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          marginBottom: "2rem",
        }}
      >
        Continue Reading
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {posts.map((p, i) => (
          <Link
            key={p.id}
            to={`/blog/${p.slug}`}
            style={{ textDecoration: "none" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: p.cover_image_url ? "1fr 88px" : "1fr",
                gap: "1.25rem",
                alignItems: "center",
                padding: "1.5rem 0",
                borderBottom:
                  i < posts.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <div>
                {p.categories && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.28)",
                      display: "block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {(p.categories as { name: string }).name}
                  </span>
                )}
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.3,
                    margin: "0 0 0.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.title}
                </p>
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {formatDate(p.published_at)}
                  </span>
                  {p.read_time_minutes && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {p.read_time_minutes} min read
                    </span>
                  )}
                </div>
              </div>

              {p.cover_image_url && (
                <img
                  src={p.cover_image_url}
                  alt={p.title}
                  style={{
                    width: "88px",
                    height: "66px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    filter: "grayscale(40%) brightness(0.7)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLElement | null>(null);
  const progress = useReadingProgress(articleRef);

  useDocumentTitle(post?.title ?? undefined);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug)
      .then((p) => {
        if (!p) navigate("/404", { replace: true });
        else setPost(p);
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.2)",
          fontFamily: "Urbanist, system-ui, sans-serif",
          fontSize: "0.82rem",
          letterSpacing: "0.1em",
        }}
      >
        LOADING
      </div>
    );
  }

  if (!post) return null;

  const author = post.authors;
  const category = post.categories;

  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "Urbanist, system-ui, sans-serif",
      }}
    >
      {/* ── Reading Progress Bar ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${progress}%`,
          height: "2px",
          background: "#fff",
          zIndex: 100,
          transition: "width 0.1s linear",
          transformOrigin: "left",
        }}
      />

      {/* ── Nav ── */}
      <nav
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 2rem",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "#000",
          zIndex: 50,
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            RG · New Hathaway
          </span>
        </Link>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
          {post.read_time_minutes ? `${post.read_time_minutes} min read` : ""}
        </span>
      </nav>

      {/* ── Cover Image ── */}
      {post.cover_image_url && (
        <div style={{ width: "100%", maxHeight: "520px", overflow: "hidden" }}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{
              width: "100%",
              height: "520px",
              objectFit: "cover",
              filter: "grayscale(25%) brightness(0.72)",
              display: "block",
            }}
          />
        </div>
      )}

      {/* ── Article ── */}
      <article
        ref={articleRef}
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding:
            "clamp(2.5rem, 5vw, 4.5rem) clamp(1.25rem, 4vw, 1.5rem) 5rem",
        }}
      >
        {/* Meta header */}
        <header style={{ marginBottom: "2.5rem" }}>
          {category && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.32)",
                display: "block",
                marginBottom: "1.1rem",
              }}
            >
              {category.name}
            </span>
          )}

          <h1
            style={{
              // clamp: min 2rem on mobile, scales up, max 3.25rem on desktop
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              marginBottom: "1.1rem",
              color: "#fff",
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {author?.avatar_url && (
              <img
                src={author.avatar_url}
                alt={author.name}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.1)",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <p
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                  margin: 0,
                }}
              >
                {author?.name ?? "Raphael G. K."}
              </p>
              <p
                style={{
                  fontSize: "0.76rem",
                  color: "rgba(255,255,255,0.28)",
                  margin: 0,
                }}
              >
                {publishDate}
              </p>
            </div>
          </div>
        </header>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.45rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                style={{
                  padding: "0.22rem 0.72rem",
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.04em",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* ── Markdown body ── */}
        <div className="prose-blog">
          <style>{`
            .prose-blog {
              font-size: clamp(1rem, 1.5vw, 1.15rem);
            }
            .prose-blog h1, .prose-blog h2, .prose-blog h3, .prose-blog h4 {
              color: #fff;
              font-weight: 800;
              letter-spacing: -0.02em;
              margin-top: 3rem;
              margin-bottom: 1rem;
              line-height: 1.2;
              font-family: Urbanist, system-ui, sans-serif;
            }
            .prose-blog h1 { font-size: clamp(1.6rem, 3vw, 2.1rem); }
            .prose-blog h2 { font-size: clamp(1.3rem, 2.5vw, 1.65rem); }
            .prose-blog h3 { font-size: clamp(1.1rem, 2vw, 1.3rem); }
            .prose-blog p {
              color: rgba(255,255,255,0.78);
              font-size: clamp(1rem, 1.5vw, 1.15rem);
              line-height: 1.9;
              margin-bottom: 1.65rem;
              font-family: Urbanist, system-ui, sans-serif;
            }
            .prose-blog strong { color: #fff; font-weight: 700; }
            .prose-blog em { color: rgba(255,255,255,0.7); font-style: italic; }
            .prose-blog a {
              color: #fff;
              text-decoration: underline;
              text-underline-offset: 4px;
              text-decoration-color: rgba(255,255,255,0.35);
              transition: text-decoration-color 0.15s;
            }
            .prose-blog a:hover {
              text-decoration-color: rgba(255,255,255,0.9);
            }
            .prose-blog blockquote {
              border-left: 2px solid rgba(255,255,255,0.25);
              padding: 0.25rem 0 0.25rem 1.5rem;
              margin: 2.5rem 0;
              color: rgba(255,255,255,0.5);
              font-style: italic;
              font-size: clamp(1.05rem, 1.8vw, 1.2rem);
            }
            .prose-blog code {
              background: rgba(255,255,255,0.06);
              padding: 0.12em 0.4em;
              border-radius: 4px;
              font-size: 0.87em;
              color: rgba(255,255,255,0.7);
              font-family: ui-monospace, 'Fira Code', monospace;
            }
            .prose-blog pre {
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 8px;
              padding: 1.4rem 1.6rem;
              overflow-x: auto;
              margin: 2.5rem 0;
            }
            .prose-blog pre code {
              background: none;
              padding: 0;
              font-size: 0.88rem;
              line-height: 1.75;
              color: rgba(255,255,255,0.75);
            }
            .prose-blog ul, .prose-blog ol {
              color: rgba(255,255,255,0.75);
              padding-left: 1.6rem;
              margin-bottom: 1.65rem;
              font-size: clamp(1rem, 1.5vw, 1.15rem);
            }
            .prose-blog li {
              margin-bottom: 0.6rem;
              line-height: 1.8;
            }
            /* Inline images in the essay */
            .prose-blog img {
              width: 100%;
              border-radius: 8px;
              margin: 2.5rem 0;
              border: 1px solid rgba(255,255,255,0.07);
              display: block;
            }
            /* Image captions — put text in italics right after an image */
            .prose-blog img + em {
              display: block;
              text-align: center;
              font-size: 0.8rem;
              color: rgba(255,255,255,0.3);
              margin-top: -1.75rem;
              margin-bottom: 2.5rem;
            }
            .prose-blog hr {
              border: none;
              border-top: 1px solid rgba(255,255,255,0.07);
              margin: 3.5rem 0;
            }
            .prose-blog table {
              width: 100%;
              border-collapse: collapse;
              margin: 2rem 0;
              font-size: 0.9rem;
            }
            .prose-blog th {
              border-bottom: 1px solid rgba(255,255,255,0.15);
              padding: 0.6rem 0.75rem;
              text-align: left;
              font-weight: 700;
              color: rgba(255,255,255,0.6);
              font-size: 0.75rem;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            .prose-blog td {
              border-bottom: 1px solid rgba(255,255,255,0.05);
              padding: 0.7rem 0.75rem;
              color: rgba(255,255,255,0.7);
            }
          `}</style>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {/* ── Suggested Posts ── */}
        <SuggestedPosts currentSlug={post.slug} categoryId={post.category_id} />

        {/* ── Footer nav ── */}
        <div
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.06em",
              }}
            >
              ← All posts
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
