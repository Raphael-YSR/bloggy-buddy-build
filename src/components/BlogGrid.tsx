import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Import Link

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  readTime?: string;
  slug?: string;
}

const BlogGrid = () => {
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "You Have About 36 Months to Map It Right",
      excerpt: "Why everyone's racing to digitize land, cities, and systems.",
      author: "LVH",
      date: "July 22, 2025",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&h=600&fit=crop",
      readTime: "5 min",
      slug: "you-have-36-months-to-map-it-right" // Add a slug property
    },
    {
      id: "2", 
      title: "You Can Learn Any GIS Skill in 2 Weeks",
      excerpt: "From remote sensing to QGIS — the mindset that makes it possible.",
      author: "LVH",
      date: "July 17, 2025",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      readTime: "8 min",
      slug: "you-can-learn-any-gis-skill-in-2-weeks" // Add slug for all existing posts
    },
    {
      id: "3",
      title: "These 3 Technologies Will Decide Your GIS Career",
      excerpt: "AI, automation, and open data are changing the game.",
      author: "LVH",
      date: "July 10, 2025", 
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop",
      readTime: "6 min",
      slug: "these-3-technologies-will-decide-your-gis-career"
    },
    {
      id: "4",
      title: "20–30 Is the Tutorial Phase for Geospatial Leaders",
      excerpt: "Avoid 3 career traps, build 3 key skills, stay future-ready.",
      author: "LVH",
      date: "July 3, 2025",
      image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&h=600&fit=crop",
      readTime: "10 min",
      slug: "20-30-is-the-tutorial-phase-for-geospatial-leaders"
    },
    {
      id: "5",
      title: "How to Think Like a Spatial Analyst (The Map of All Knowledge)",
      excerpt: "From cartography to cognitive maps — become a second-tier geospatial thinker.",
      author: "LVH", 
      date: "June 26, 2025",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      readTime: "12 min",
      slug: "how-to-think-like-a-spatial-analyst"
    },
    {
      id: "6",
      title: "This One Decision Will Define Your GIS Path",
      excerpt: "Why clarity in specialization can shape your entire career.",
      author: "LVH",
      date: "June 23, 2025",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
      readTime: "7 min",
      slug: "this-one-decision-will-define-your-gis-path"
    }
  ];

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

                {/* Changed Button to Link */}
                <Link href={`/blog/${post.slug}`} passHref>
                  <Button variant="link" className="p-0 h-auto text-foreground hover:text-brand-accent underline-offset-4">
                    Read Full Post
                  </Button>
                </Link>
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