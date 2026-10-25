import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  MapPin,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Moon,
  Sun,
  UserCheck,
  Laptop,
  Flame,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { dataStore } from "@/lib/dataStore";
import { toast } from "sonner";

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandMenu = ({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: CommandMenuProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = useCallback(
    (val: boolean) => {
      if (isControlled && controlledOnOpenChange) {
        controlledOnOpenChange(val);
      } else {
        setInternalOpen(val);
      }
    },
    [isControlled, controlledOnOpenChange]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const communities = dataStore.getCommunities({ limit: 8 });
  const categories = dataStore.getCategories();
  const locations = dataStore.getLocations();

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search communities, cities, interests, actions (⌘K)..." />
      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty>No matching communities or actions found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect(() => navigate("/browse"))}>
            <Compass className="mr-2 h-4 w-4 text-primary" />
            <span>Explore All Communities</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate("/create-community"))}>
            <PlusCircle className="mr-2 h-4 w-4 text-emerald-600" />
            <span>List a New Community</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-sky-600" />
            <span>Your Organizer Space & Saved</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate("/admin"))}>
            <ShieldCheck className="mr-2 h-4 w-4 text-amber-600" />
            <span>Platform Admin Dashboard</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Popular Communities">
          {communities.map((comm) => (
            <CommandItem
              key={comm.id}
              value={`${comm.name} ${comm.short_description} ${comm.locations?.city}`}
              onSelect={() => handleSelect(() => navigate(`/community/${comm.slug}`))}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium">{comm.name}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  · {comm.locations?.city} ({comm.member_count} members)
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-50" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Browse by Category">
          {categories.map((cat) => (
            <CommandItem
              key={cat.id}
              value={cat.name}
              onSelect={() => handleSelect(() => navigate(`/browse?category=${cat.slug}`))}
            >
              <span className="text-xs font-semibold mr-2 px-2 py-0.5 rounded-full bg-secondary">
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">{cat.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Browse by City">
          {locations.slice(0, 5).map((loc) => (
            <CommandItem
              key={loc.id}
              value={loc.city}
              onSelect={() => handleSelect(() => navigate(`/browse?location=${encodeURIComponent(loc.city)}`))}
            >
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              <span>{loc.city}, {loc.country}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme & Demo Roles">
          <CommandItem onSelect={() => handleSelect(() => setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4 text-amber-500" /> : <Moon className="mr-2 h-4 w-4 text-sky-500" />}
            <span>Toggle Theme ({theme === "dark" ? "Switch to Light" : "Switch to Dark"})</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              handleSelect(() => {
                dataStore.switchDemoUser("platform_admin");
                toast.success("Switched role to Elena Vance (Platform Admin)");
                navigate("/admin");
              })
            }
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-amber-600" />
            <span>Switch Role: Elena Vance (Platform Admin)</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              handleSelect(() => {
                dataStore.switchDemoUser("organizer");
                toast.success("Switched role to Aarav Sharma (Community Organizer)");
                navigate("/dashboard");
              })
            }
          >
            <UserCheck className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Switch Role: Aarav Sharma (Organizer)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
