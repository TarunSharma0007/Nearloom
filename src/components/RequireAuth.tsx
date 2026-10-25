import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth, type AppRole } from "@/contexts/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
  /** If specified, only these roles can access the route */
  allowedRoles?: AppRole[];
  /** Redirect path when not authenticated (defaults to /auth) */
  redirectTo?: string;
}

/**
 * Route guard that redirects unauthenticated users to the auth page.
 * Optionally restricts access to specific roles.
 *
 * Usage:
 *   <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
 *   <Route path="/admin" element={<RequireAuth allowedRoles={["platform_admin"]}><Admin /></RequireAuth>} />
 */
export function RequireAuth({
  children,
  allowedRoles,
  redirectTo = "/auth",
}: RequireAuthProps) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // Show loader while checking session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" role="status">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying your session…
          </p>
        </div>
        <span className="sr-only">Checking authentication</span>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role check (when roles are specified)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4 p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold">Access Restricted</h1>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            ← Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
