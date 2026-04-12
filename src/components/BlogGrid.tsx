// src/components/BlogGrid.tsx
// Fetches posts from Supabase instead of static data.
// Install: npm install @supabase/supabase-js

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getPublishedPosts, type Post } from '@/lib/supabase';

const BlogGrid = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-4">THE BLOG</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Explore Geospatial Frontiers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into geospatial intelligence, smart mapping, and AI in land and urban systems.
          </p>
        </div>

        {/* States */}
        {loading && (
          <div className="text-center py-20 text-muted-foreground">Loading posts…</div>
        )}
        {error && (
          <div className="text-center py-20 text-red-400">
            Failed to load posts: {error}
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No posts published yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block">
                    <Card className="bg-gradient-card border-border hover:border-brand-muted/50 transition-all duration-300 group cursor-pointer overflow-hidden h-full">
                      {post.cover_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter grayscale"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        {/* Category badge */}
                        {(post as any).categories && (
                          <span className="text-xs uppercase tracking-wider text-brand-muted mb-2 block">
                            {(post as any).categories.name}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-brand-accent transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-brand-muted mb-4">
                          <span>{(post as any).authors?.name ?? 'RG'}</span>
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        {post.read_time_minutes && (
                          <p className="text-xs text-brand-muted mb-4">{post.read_time_minutes} min read</p>
                        )}
                        <Button variant="link" className="p-0 h-auto text-foreground hover:text-brand-accent underline-offset-4">
                          Read Full Post
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
