import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Plus, ShieldCheck, UserRound, X, ChevronRight } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Explore", to: "/browse" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Our story", to: "/about" },
];

export const Navbar = () => {
  const { isAuthenticated, displayName, avatarUrl, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
      isActive
        ? "bg-foreground text-background shadow-sm"
        : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04]",
    );

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <nav className="container flex h-[72px] items-center justify-between px-4 md:px-8" aria-label="Main navigation">
        <BrandLogo />

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => <NavLink key={item.to} to={item.to} className={navClass}>{item.label}</NavLink>)}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Button asChild className="hidden rounded-full shadow-sm sm:inline-flex">
                <Link to="/create-community"><Plus className="mr-1.5 h-4 w-4" />List a community</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-foreground/10" aria-label="Open account menu">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-foreground/10 shadow-premium-lg p-1">
                  <div className="px-3 py-2.5 border-b border-foreground/5 mb-1">
                    <p className="font-semibold text-sm">{displayName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg gap-2">
                    <LayoutDashboard className="h-4 w-4" />Your space
                    <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground" />
                  </DropdownMenuItem>
                  {role === "platform_admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-lg gap-2">
                      <ShieldCheck className="h-4 w-4" />Admin panel
                      <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground" />
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="rounded-full"><Link to="/auth">Sign in</Link></Button>
              <Button asChild className="rounded-full shadow-sm gradient-primary text-white border-0 hover:opacity-90"><Link to="/auth?mode=signup">Join Nearloom</Link></Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-foreground/10 bg-background px-4 py-5 lg:hidden animate-soft-reveal">
          <div className="container flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/create-community" className={navClass} onClick={() => setMobileMenuOpen(false)}>List a community</NavLink>
            {!isAuthenticated && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="rounded-full"><Link to="/auth">Sign in</Link></Button>
                <Button asChild className="rounded-full gradient-primary text-white border-0"><Link to="/auth?mode=signup">Join Nearloom</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
