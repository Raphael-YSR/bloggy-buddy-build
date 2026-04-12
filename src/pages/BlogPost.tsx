// src/pages/BlogPost.tsx
// Route: /blog/:slug
//
// Install markdown renderer: npm install react-markdown remark-gfm
// Then update App.tsx: <Route path="/blog/:slug" element={<BlogPost />} />

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, type Post } from "@/lib/supabase";
import { useDocumentTitle } from "@/hooks/use-document-title";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  useDocumentTitle(post?.title);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then((p) => {
        if (!p) navigate("/404", { replace: true });
        else setPost(p);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "Urbanist, system-ui, sans-serif",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!post) return null;

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
      {/* Nav */}
      <nav
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 2rem",
          height: "56px",
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
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            RG · New Hathaway
          </span>
        </Link>
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>
          {post.read_time_minutes ? `${post.read_time_minutes} min read` : ""}
        </span>
      </nav>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div style={{ width: "100%", maxHeight: "480px", overflow: "hidden" }}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{
              width: "100%",
              height: "480px",
              objectFit: "cover",
              filter: "grayscale(30%) brightness(0.75)",
            }}
          />
        </div>
      )}

      {/* Article */}
      <article
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "4rem 1.5rem 6rem",
        }}
      >
        {/* Meta */}
        <div style={{ marginBottom: "2.5rem" }}>
          {(post as any).categories && (
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              {(post as any).categories.name}
            </span>
          )}
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
              color: "#fff",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {(post as any).authors?.avatar_url && (
              <img
                src={(post as any).authors.avatar_url}
                alt={(post as any).authors.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            )}
            <div>
              <p
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  margin: 0,
                }}
              >
                {(post as any).authors?.name ?? "Raphael G. K."}
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.3)",
                  margin: 0,
                }}
              >
                {publishDate}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                style={{
                  padding: "0.2rem 0.7rem",
                  borderRadius: "20px",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Markdown Body */}
        <div className="prose-blog">
          <style>{`
            .prose-blog h1, .prose-blog h2, .prose-blog h3, .prose-blog h4 {
              color: #fff;
              font-weight: 800;
              letter-spacing: -0.02em;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
              line-height: 1.2;
            }
            .prose-blog h1 { font-size: 2rem; }
            .prose-blog h2 { font-size: 1.5rem; }
            .prose-blog h3 { font-size: 1.2rem; }
            .prose-blog p {
              color: rgba(255,255,255,0.78);
              font-size: 1.05rem;
              line-height: 1.85;
              margin-bottom: 1.5rem;
            }
            .prose-blog strong { color: #fff; font-weight: 700; }
            .prose-blog em { color: rgba(255,255,255,0.7); }
            .prose-blog a { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
            .prose-blog a:hover { opacity: 0.7; }
            .prose-blog blockquote {
              border-left: 3px solid rgba(255,255,255,0.2);
              padding-left: 1.5rem;
              margin: 2rem 0;
              color: rgba(255,255,255,0.5);
              font-style: italic;
              font-size: 1.1rem;
            }
            .prose-blog code {
              background: rgba(255,255,255,0.06);
              padding: 0.1em 0.4em;
              border-radius: 4px;
              font-size: 0.88em;
              color: rgba(255,255,255,0.7);
              font-family: ui-monospace, monospace;
            }
            .prose-blog pre {
              background: rgba(255,255,255,0.04);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 8px;
              padding: 1.25rem 1.5rem;
              overflow-x: auto;
              margin: 2rem 0;
            }
            .prose-blog pre code {
              background: none;
              padding: 0;
              font-size: 0.9rem;
              line-height: 1.7;
            }
            .prose-blog ul, .prose-blog ol {
              color: rgba(255,255,255,0.75);
              padding-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .prose-blog li { margin-bottom: 0.5rem; line-height: 1.75; }
            .prose-blog img {
              width: 100%;
              border-radius: 8px;
              margin: 2rem 0;
              border: 1px solid rgba(255,255,255,0.07);
            }
            .prose-blog hr {
              border: none;
              border-top: 1px solid rgba(255,255,255,0.07);
              margin: 3rem 0;
            }
          `}</style>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "5rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
              }}
            >
              ← Back to all posts
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
