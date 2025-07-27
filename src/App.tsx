import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog1Page from "./blog/you-have-36-months-to-map-it-right/page";
import Blog2Page from "./blog/you-can-learn-any-gis-skill-in-2-weeks/page";
import Blog3Page from "./blog/these-3-technologies-will-decide-your-gis-career/page";
import Blog4Page from "./blog/20-30-is-the-tutorial-phase-for-geospatial-leaders/page"; 
import Blog6Page from "./blog/this-one-decision-will-define-your-gis-path/page";
import Blog5Page from "./blog/how-to-think-like-a-spatial-analyst/page";  

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/you-have-36-months-to-map-it-right" element={<Blog1Page />} />
          <Route path="/blog/you-can-learn-any-gis-skill-in-2-weeks" element={<Blog2Page />} />
          <Route path="/blog/these-3-technologies-will-decide-your-gis-career" element={<Blog3Page />} />
          <Route path="/blog/20-30-is-the-tutorial-phase-for-geospatial-leaders" element={<Blog4Page />} />
          <Route path="/blog/this-one-decision-will-define-your-gis-path" element={<Blog6Page />} />
          <Route path="/blog/how-to-think-like-a-spatial-analyst" element={<Blog5Page />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
