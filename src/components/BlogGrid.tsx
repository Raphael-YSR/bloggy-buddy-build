import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  readTime?: string;
}

const BlogGrid = () => {
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "You have about 36 months to make it",
      excerpt: "Why everyone is racing to get rich",
      author: "Dan Koe",
      date: "July 22, 2025",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&h=600&fit=crop",
      readTime: "5 min"
    },
    {
      id: "2", 
      title: "You can learn anything in 2 weeks",
      excerpt: "I know it sounds insane.",
      author: "Dan Koe",
      date: "July 17, 2025",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      readTime: "8 min"
    },
    {
      id: "3",
      title: "These 3 Decisions Will Determine If You Get Rich",
      excerpt: "Delusional goals rewire your brain.",
      author: "Dan Koe",
      date: "July 10, 2025", 
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop",
      readTime: "6 min"
    },
    {
      id: "4",
      title: "20-30 Years Old Is The Tutorial Phase, Don't F*ck It Up",
      excerpt: "Avoid 3 things, do 3 things, don't get mad.",
      author: "Dan Koe",
      date: "July 3, 2025",
      image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&h=600&fit=crop",
      readTime: "10 min"
    },
    {
      id: "5",
      title: "How To Think Like A Genius (The Map Of All Knowledge)",
      excerpt: "Become a second-tier thinker.",
      author: "Dan Koe", 
      date: "June 26, 2025",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      readTime: "12 min"
    },
    {
      id: "6",
      title: "This single decision will determine most of your life",
      excerpt: "Why indecisiveness is death.",
      author: "Dan Koe",
      date: "June 23, 2025",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
      readTime: "7 min"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-4">THE BLOG</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Explore Your Curiosity
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives on human potential, lifestyle design, & digital business.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-gradient-card border-border hover:border-brand-muted/50 transition-all duration-300 group cursor-pointer overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter grayscale"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-brand-muted mb-4">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>

                <Button variant="link" className="p-0 h-auto text-foreground hover:text-brand-accent underline-offset-4">
                  Read Full Post
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-brand-muted/30 hover:border-brand-accent hover:text-brand-accent">
            Load More Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;