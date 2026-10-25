import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { dataStore, type DemoUser } from "@/lib/dataStore";

// ── Types ──
export type AppRole = "platform_admin" | "organizer" | "member" | "guest";

interface AuthState {
  /** Supabase user (null when using demo mode or signed out) */
  user: User | null;
  /** Active session */
  session: Session | null;
  /** Demo user when running offline */
  demoUser: DemoUser | null;
  /** Whether user is authenticated (either via Supabase or demo) */
  isAuthenticated: boolean;
  /** Current role */
  role: AppRole;
  /** Display name */
  displayName: string;
  /** Email */
  email: string;
  /** Avatar URL */
  avatarUrl: string | null;
  /** Whether initial session check is still loading */
  loading: boolean;
  /** Whether Supabase is configured */
  isLive: boolean;
}

interface AuthActions {
  signOut: () => Promise<void>;
  switchDemoUser: (role: AppRole) => void;
  refreshSession: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Listen for Supabase auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        },
      );

      // Get initial session
      supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Demo mode — use dataStore
      const currentDemoUser = dataStore.getCurrentUser();
      setDemoUser(currentDemoUser);
      setLoading(false);

      const handleAuthChange = () => {
        setDemoUser(dataStore.getCurrentUser());
      };
      window.addEventListener("nearloom-auth-change", handleAuthChange);
      return () => window.removeEventListener("nearloom-auth-change", handleAuthChange);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      dataStore.signOut();
    }
    setUser(null);
    setSession(null);
    setDemoUser(null);
  }, []);

  const switchDemoUser = useCallback((role: AppRole) => {
    if (role === "guest") {
      dataStore.signOut();
      setDemoUser(null);
    } else {
      const newUser = dataStore.switchDemoUser(role);
      setDemoUser(newUser);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.refreshSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    }
  }, []);

  // Derive computed state
  const isAuthenticated = isSupabaseConfigured ? !!user : !!demoUser;

  const role: AppRole = (() => {
    if (isSupabaseConfigured) {
      // In production, roles come from the user_roles table via RLS
      // For now, default to "member" for authenticated users
      return user ? "member" : "guest";
    }
    return demoUser?.role ?? "guest";
  })();

  const displayName = (() => {
    if (user) return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    if (demoUser) return demoUser.full_name;
    return "Guest";
  })();

  const email = user?.email || demoUser?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || demoUser?.avatar_url || null;

  const value: AuthContextType = {
    user,
    session,
    demoUser,
    isAuthenticated,
    role,
    displayName,
    email,
    avatarUrl,
    loading,
    isLive: isSupabaseConfigured,
    signOut,
    switchDemoUser,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
