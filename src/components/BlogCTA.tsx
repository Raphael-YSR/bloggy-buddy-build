// src/components/BlogCTA.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletter } from "@/hooks/use-newsletter";

const BlogCTA = () => {
  const { email, setEmail, status, message, handleSubmit } = useNewsletter();

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Author Info */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
            <img
              src="https://i.postimg.cc/zyZQnX6K/Snapchat-1896959815.jpg"
              alt="Raphael"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-3">
              Hey, I'm Raphael.
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              I'm a Geomatics & GIS student passionate about the intersection of
              spatial data, artificial intelligence, and sustainable
              development.
            </p>
            <p className="text-brand-muted mb-4 leading-relaxed">
              Previously, I focused on surveying, cartography, and spatial
              databases. Now, I write to explore how geospatial technology is
              reshaping land use, urban systems, and decision-making in a
              rapidly digitizing world.
            </p>
            <p className="text-brand-muted leading-relaxed">
              I'm also the Founder & CEO of New Hathaway, a data and GIS
              analytics firm leveraging AI to power smarter spatial solutions
              for the future.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-16">
          <a
            href="https://instagram.com/newhathaway"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="hero"
              size="sm"
              className="relative z-10 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:opacity-50 before:translate-x-[-100%] before:transition-transform before:duration-300 hover:before:translate-x-0"
            >
              Instagram
            </Button>
          </a>
          <a
            href="https://twitter.com/newhathaway"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="hero"
              size="sm"
              className="relative z-10 overflow-hidden before:absolute before:inset-0 before:bg-blue-400 before:opacity-50 before:translate-x-[-100%] before:transition-transform before:duration-300 hover:before:translate-x-0"
            >
              Twitter
            </Button>
          </a>
          <a
            href="https://github.com/Raphael-YSR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="hero"
              size="sm"
              className="relative z-10 overflow-hidden before:absolute before:inset-0 before:bg-gray-800 before:opacity-50 before:translate-x-[-100%] before:transition-transform before:duration-300 hover:before:translate-x-0"
            >
              GitHub
            </Button>
          </a>
          <a
            href="https://linkedin.com/in/newhathaway"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="hero"
              size="sm"
              className="relative z-10 overflow-hidden before:absolute before:inset-0 before:bg-blue-600 before:opacity-50 before:translate-x-[-100%] before:transition-transform before:duration-300 hover:before:translate-x-0"
            >
              LinkedIn
            </Button>
          </a>
          <a
            href="https://www.facebook.com/share/19rxmoniMY/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="hero"
              size="sm"
              className="relative z-10 overflow-hidden before:absolute before:inset-0 before:bg-blue-500 before:opacity-50 before:translate-x-[-100%] before:transition-transform before:duration-300 hover:before:translate-x-0"
            >
              Facebook
            </Button>
          </a>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gain a New Perspective on Maps & Meaning
          </h2>
          <p className="text-xl text-brand-muted mb-8 max-w-2xl mx-auto">
            Join 120,000+ thinkers exploring geospatial innovation, AI
            applications, and real-world GIS practices that are building the
            future.
          </p>

          {/* Newsletter Signup */}
          {status === "success" ? (
            <div className="max-w-md mx-auto mb-8 py-4">
              <p className="text-white font-semibold text-lg mb-1">
                You're in. ✦
              </p>
              <p className="text-brand-muted text-sm">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                  required
                  disabled={status === "loading"}
                />
                <Button
                  variant="cta"
                  type="submit"
                  className="shrink-0"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Joining…" : "Join Now"}
                </Button>
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm mt-2">{message}</p>
              )}

              {/* Your exact copy — do not change */}
              <p className="text-sm text-brand-muted mt-3 flex items-center justify-center gap-2">
                <span>🔗</span>
                Receive 2 free insights monthly on GIS, innovation & spatial
              </p>
            </form>
          )}
        </div>

        {/* Bottom Tagline */}
        <div className="text-center pt-16 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white italic">RG</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Think Spatial. Build Smart. Lead Change.
          </h3>
          <p className="text-brand-muted">
            I dive deep into spatial analysis, location intelligence, and
            real-world GIS projects — giving you smart, digestible insights that
            improve your thinking in 10 minutes or less.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
