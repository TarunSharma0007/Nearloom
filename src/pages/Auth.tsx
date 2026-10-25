import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Eye, EyeOff, Loader2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import { PasswordStrength } from "@/components/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { checkRateLimit, getRateLimitCooldown, sanitizeInput, isValidEmail, validatePassword } from "@/lib/security";
import { dataStore } from "@/lib/dataStore";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const defaultTab = searchParams.get("mode") === "signup" ? "signup" : "signin";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    // Rate limiting
    if (!checkRateLimit("signin", 5, 60_000)) {
      const remaining = getRateLimitCooldown("signin", 60_000);
      setRateLimited(true);
      setCooldown(remaining);
      toast.error(`Too many attempts. Try again in ${remaining}s`);
      return;
    }

    const cleanEmail = sanitizeInput(email.trim());
    if (!isValidEmail(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back to Nearloom");
      }
    } else {
      // Demo mode sign-in
      dataStore.switchDemoUser("organizer");
      toast.success("Welcome back to Nearloom (Demo Mode)");
      navigate("/dashboard", { replace: true });
    }

    setLoading(false);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanEmail = sanitizeInput(email.trim());
    const cleanName = sanitizeInput(fullName.trim());

    if (!isValidEmail(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!cleanName || cleanName.length < 2) {
      toast.error("Please enter your name (at least 2 characters)");
      return;
    }

    // Password validation
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      toast.error(passwordCheck.errors[0]);
      return;
    }

    // Rate limiting
    if (!checkRateLimit("signup", 3, 120_000)) {
      const remaining = getRateLimitCooldown("signup", 120_000);
      setRateLimited(true);
      setCooldown(remaining);
      toast.error(`Too many attempts. Try again in ${remaining}s`);
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: cleanName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your inbox to confirm your email");
      else toast.success("Your Nearloom account is ready");
    } else {
      // Demo mode sign-up
      dataStore.switchDemoUser("organizer");
      toast.success("Account created! (Demo Mode)");
      navigate("/dashboard", { replace: true });
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured) {
      dataStore.switchDemoUser("organizer");
      toast.success("Signed in with Google (Demo Mode)");
      navigate("/dashboard", { replace: true });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const cleanEmail = sanitizeInput(email.trim());
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      toast.error("Enter a valid email first, then choose reset password");
      return;
    }

    if (!checkRateLimit("reset", 2, 120_000)) {
      toast.error("Please wait before requesting another reset");
      return;
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) toast.error(error.message);
      else toast.success("Password reset instructions are on their way");
    } else {
      toast.success("Password reset email sent (Demo Mode)");
    }
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      {/* Left Panel — Brand Side */}
      <section className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="gradient-aurora absolute inset-0 opacity-20 mix-blend-soft-light" />
        <div className="map-grid absolute inset-0 opacity-10" />
        <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-indigo/20 blur-3xl" />
        <BrandLogo link={false} className="relative [&_span]:text-background" />

        <div className="relative max-w-xl">
          <p className="eyebrow text-warning"><Sparkles className="h-4 w-4" />Belonging starts small</p>
          <h1 className="mt-7 font-display text-7xl leading-[0.88] tracking-display-tight">
            One good introduction can change your whole city.
          </h1>
          <div className="mt-10 grid grid-cols-3 gap-3 text-xs text-background/65 stagger-children">
            <div className="glass-card rounded-2xl p-4 !bg-background/[0.06] !border-background/10">
              <MapPin className="mb-8 h-5 w-5 text-warning" />Local by design
            </div>
            <div className="glass-card rounded-2xl p-4 !bg-background/[0.06] !border-background/10">
              <BadgeCheck className="mb-8 h-5 w-5 text-warning" />Trusted listings
            </div>
            <div className="glass-card rounded-2xl p-4 !bg-background/[0.06] !border-background/10">
              <ShieldCheck className="mb-8 h-5 w-5 text-warning" />You stay in control
            </div>
          </div>
        </div>
        <p className="relative text-xs text-background/45">No infinite feed. No awkward cold start. Just real communities.</p>
      </section>

      {/* Right Panel — Auth Forms */}
      <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md page-enter">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <BrandLogo />
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Home</Link>
            </Button>
          </div>
          <div className="mb-7">
            <p className="eyebrow">Your Nearloom</p>
            <h1 className="mt-3 font-display text-5xl tracking-display">Come on in.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Save discoveries, manage listings, and keep your local life close.
            </p>
          </div>

          <Card className="rounded-[1.7rem] border-foreground/10 bg-card shadow-premium-lg">
            <CardContent className="p-5 sm:p-7">
              <Tabs defaultValue={defaultTab}>
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-secondary">
                  <TabsTrigger value="signin" className="rounded-lg font-semibold">Sign in</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg font-semibold">Create account</TabsTrigger>
                </TabsList>

                {/* Sign In */}
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <button
                          type="button"
                          onClick={() => void handleResetPassword()}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 rounded-xl pr-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl gradient-primary text-white border-0 shadow-sm hover:opacity-90 transition-opacity"
                      disabled={loading || rateLimited}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {rateLimited ? `Try again in ${cooldown}s` : "Sign in"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Your name</Label>
                      <Input
                        id="signup-name"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="How should we address you?"
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        className="h-12 rounded-xl"
                        required
                      />
                      <PasswordStrength password={password} />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl gradient-primary text-white border-0 shadow-sm hover:opacity-90 transition-opacity"
                      disabled={loading || rateLimited}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {rateLimited ? `Try again in ${cooldown}s` : "Create my account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
              </div>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-foreground/10 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => void handleGoogleSignIn()}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.8 12.2c0-.7-.1-1.5-.2-2.2H12v4.1h5.5a4.7 4.7 0 0 1-2 3.1v2.7h3.3c2-1.8 3-4.5 3-7.7Z" fill="#4285F4"/>
                  <path d="M12 22c2.8 0 5.1-.9 6.8-2.5l-3.3-2.6c-.9.6-2.1 1-3.5 1a6 6 0 0 1-5.6-4.1H3v2.7A10 10 0 0 0 12 22Z" fill="#34A853"/>
                  <path d="M6.4 13.8A6 6 0 0 1 6.1 12c0-.6.1-1.2.3-1.8V7.5H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.5l3.4-2.7Z" fill="#FBBC05"/>
                  <path d="M12 6.1c1.5 0 2.9.5 3.9 1.5l3-3A10 10 0 0 0 3 7.5l3.4 2.7A6 6 0 0 1 12 6.1Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
            <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Auth;
