import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layouts/MainLayout";
import Index from "./pages/Index";
import CalendarGame from "./pages/CalendarGame";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrimePatrol from "./pages/PrimePatrol";
import MathBola from "./pages/Mathbola";
import BharatGame from "./pages/BharatGame";
import PahalGame from "./pages/PahalGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/games/calendar" element={<CalendarGame />} />
              <Route path="/games/prime" element={<PrimePatrol />} />
              <Route path="/games/mathbola" element={<MathBola />} />
              <Route path="/games/bharat" element={<BharatGame />} />
              <Route path="/games/pahal" element={<PahalGame />} />
              {/* <Route path="/" element={<BharatGame />} /> */}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

