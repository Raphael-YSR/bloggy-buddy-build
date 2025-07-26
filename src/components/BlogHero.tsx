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
            <span className="text-2xl font-bold text-white italic">DK</span>
          </div>
          <div className="text-right">
            <Button variant="hero" size="sm" className="text-sm">
              Read The Koe Letters
            </Button>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-4">DAN KOE</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Work Less. Earn<br />
            More. Enjoy Life.
          </h1>
          <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Join 120,000+ getting mindf*cked twice a week reading
            about the mind, the internet, and the future.
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
            Receive 2 free letters a week
          </p>
        </form>

        {/* Resources Section */}
        <div className="text-center">
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-4">RESOURCES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join The New 1%
          </h2>
          <p className="text-brand-muted">
            Become future-proof with these tools
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;