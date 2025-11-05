import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Waiter from "./pages/Waiter";
import Kitchen from "./pages/Kitchen";
import Admin from "./pages/Admin";
import Bill from "./pages/Bill";
import Unauthorized from "./pages/Unauthorized";
=======
import { TablesProvider } from "@/contexts/TablesContext";
import Index from "./pages/Index";
import Kitchen from "./pages/Kitchen";
>>>>>>> 8f92bec9b88629fe024341da12ebad2101bbdd29
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
<<<<<<< HEAD
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/waiter"
              element={
                <ProtectedRoute allowedRoles={["waiter"]}>
                  <Waiter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute allowedRoles={["kitchen"]}>
                  <Kitchen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/bill/:tableId" element={<Bill />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
=======
        <TablesProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cozinha" element={<Kitchen />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TablesProvider>
>>>>>>> 8f92bec9b88629fe024341da12ebad2101bbdd29
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
