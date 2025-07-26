import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const BlogCTA = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-20 px-4 bg-gradient-hero">
      <div className="max-w-4xl mx-auto">
        {/* Author Info */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
              alt="Dan Koe"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-3">Hey, I'm Dan.</h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              I'm the author of The Art of Focus, co-founder of Kortex, and writer obsessed with the 
              mind, the internet, and the future.
            </p>
            <p className="text-brand-muted leading-relaxed">
              Previously, I was a brand advisor for creators and influencers. Now I teach writing as a 
              way to discover your life's work, secure your future, and enjoy a creative lifestyle.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-16">
          <Button variant="hero" size="sm">Instagram</Button>
          <Button variant="hero" size="sm">Twitter</Button>
          <Button variant="hero" size="sm">YouTube</Button>
          <Button variant="hero" size="sm">LinkedIn</Button>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gain A New Perspective On Life & Business
          </h2>
          <p className="text-xl text-brand-muted mb-8 max-w-2xl mx-auto">
            Join 120,000+ changing their life with theory and practice about the mind, 
            the internet, and the future.
          </p>

          {/* Newsletter Signup */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
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
                Join Now
              </Button>
            </div>
            <p className="text-sm text-brand-muted mt-3 flex items-center justify-center gap-2">
              <span>🔗</span>
              Receive 2 free letters a week
            </p>
          </form>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center pt-16 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white italic">DK</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Work Less. Earn More. Enjoy Life.</h3>
          <p className="text-brand-muted">
            I dive deep into human potential, lifestyle design, and one-person businesses to give 
            you a unique, digestible way of improving your life in 10 minutes or less.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;