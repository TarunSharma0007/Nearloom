import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Browse = lazy(() => import("./pages/Browse"));
const CommunityDetail = lazy(() => import("./pages/CommunityDetail"));
const CreateCommunity = lazy(() => import("./pages/CreateCommunity"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RouteEffects = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

const RouteLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background gradient-mesh" role="status">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border border-primary/10" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading…</p>
    </div>
    <span className="sr-only">Loading page</span>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange={false}
      storageKey="nearloom-theme"
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteEffects />
              <Suspense fallback={<RouteLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/community/:slug" element={<CommunityDetail />} />
                  <Route
                    path="/create-community"
                    element={
                      <RequireAuth>
                        <CreateCommunity />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <RequireAuth allowedRoles={["platform_admin"]}>
                        <AdminDashboard />
                      </RequireAuth>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
