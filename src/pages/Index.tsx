import BlogHero from "@/components/BlogHero";
import BlogGrid from "@/components/BlogGrid";
import BlogCTA from "@/components/BlogCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <BlogHero />
      <BlogGrid />
      <BlogCTA />
    </div>
  );
};

export default Index;
