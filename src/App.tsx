import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TablesProvider } from "@/contexts/TablesContext";
import Index from "./pages/Index";
import Kitchen from "./pages/Kitchen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const basename = import.meta.env.MODE === "production" 
  ? "/psg-si-2025-2-p7-tisige-4048101-tisigegrupo1" 
  : "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <TablesProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cozinha" element={<Kitchen />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TablesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
