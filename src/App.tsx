import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme/ThemeProvider";
import Index from "./pages/Index";

const queryClient = new QueryClient();

/**
 * Default App structure for single-page applications.
 * 
 * For multi-page apps with routing:
 * 1. Import BrowserRouter, Routes, Route from 'react-router-dom'
 * 2. Wrap content in <BrowserRouter><Routes>...</Routes></BrowserRouter>
 * 3. Add routes: <Route path="/about" element={<About />} />
 * 
 * See docs/ROUTING.md for detailed instructions.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
