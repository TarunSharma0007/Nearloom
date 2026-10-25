import { Link, useLocation } from "react-router-dom";
import { Compass, Home, Plus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenSearch?: () => void;
}

export const MobileNav = ({ onOpenSearch }: MobileNavProps) => {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: Home, isActive: pathname === "/" },
    { label: "Explore", to: "/browse", icon: Compass, isActive: pathname.startsWith("/browse") },
    { label: "Search", action: onOpenSearch, icon: Search, isAction: true },
    { label: "Your Space", to: "/dashboard", icon: User, isActive: pathname === "/dashboard" || pathname.startsWith("/admin") },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block border-t border-foreground/10 bg-background/95 backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.label}
            to={item.to!}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
              item.isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", item.isActive ? "stroke-[2.5]" : "stroke-2")} />
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Center Floating Plus Action */}
        <Link
          to="/create-community"
          className="relative -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
          aria-label="List a community"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </Link>

        {/* Search button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="h-5 w-5 stroke-2" />
          <span>Search</span>
        </button>

        {/* Dashboard button */}
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
            pathname === "/dashboard" || pathname.startsWith("/admin")
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className={cn("h-5 w-5", pathname === "/dashboard" ? "stroke-[2.5]" : "stroke-2")} />
          <span>Space</span>
        </Link>
      </div>
    </div>
  );
};
