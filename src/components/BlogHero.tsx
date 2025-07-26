import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const BlogHero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-8">
            <span className="text-2xl font-bold text-white italic">RG</span>
          </div>
          <div className="text-right">
            <Button variant="hero" size="sm" className="text-sm">
              Mapping the Future: A Geomatics & GIS Journey
            </Button>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-4">RAPHAEL G. K.</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Think Spatial. Build<br />
            Smart. Lead Change.
          </h1>
          <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Join 120,000+ readers exploring the world of maps, geospatial tech, 
            and digital transformation.
          </p>
        </div>

        {/* Newsletter Signup */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-16">
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
              required
            />
            <Button variant="cta" type="submit" className="shrink-0">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-brand-muted mt-3 flex items-center justify-center gap-2">
            <span>🔗</span>
            Receive 2 free insights weekly on GIS, innovation & spatial thinking
          </p>
        </form>

        {/* Resources Section */}
        <div className="text-center">
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-4">RESOURCES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Step Into the Geospatial Future
          </h2>
          <p className="text-brand-muted">
            Explore tools and ideas shaping sustainable and data-driven development.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;