import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationProvider } from "./contexts/NavigationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/layout/Header";
import { AuthModal } from "./components/auth/AuthModal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import Developers from "./pages/Developers";
import Companies from "./pages/Companies";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="puzzleconnect-theme">
      <TooltipProvider>
        <BrowserRouter>
          <NavigationProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/developers" element={<Developers />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <AuthModal />
                <Toaster />
                <Sonner />
              </div>
            </AuthProvider>
          </NavigationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
