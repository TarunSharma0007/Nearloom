import { useState, useEffect } from "react";
import { ArrowUpRight, BadgeCheck, Heart, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dataStore } from "@/lib/dataStore";
import { toast } from "sonner";

interface CommunityCardProps {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
  category?: { name: string; slug: string };
  location?: { city: string; state: string };
  member_count?: number;
  meeting_mode?: string | null;
  tags?: { name: string }[];
  is_verified?: boolean;
  className?: string;
  onBookmarkToggle?: (saved: boolean) => void;
}

const accents = [
  "from-[#d95d3f]/90 to-[#b5462b] text-white",
  "from-[#2a593c]/90 to-[#1f432d] text-white",
  "from-[#dca835]/90 to-[#c59223] text-[#17231f]",
  "from-[#26536b]/90 to-[#1b3e52] text-white",
  "from-[#8c3d55]/90 to-[#722e43] text-white",
  "from-[#51443a]/90 to-[#3c322a] text-white",
];

export const CommunityCard = ({
  id,
  name,
  slug,
  short_description,
  logo_url,
  category,
  location,
  member_count,
  meeting_mode,
  tags,
  is_verified,
  className,
  onBookmarkToggle,
}: CommunityCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(dataStore.isSaved(id));
    const handleSavedChange = () => setIsSaved(dataStore.isSaved(id));
    window.addEventListener("nearloom-saved-change", handleSavedChange);
    return () => window.removeEventListener("nearloom-saved-change", handleSavedChange);
  }, [id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = dataStore.toggleSave(id);
    setIsSaved(saved);
    if (saved) {
      toast.success(`Saved "${name}" to your space`, {
        description: "Find it anytime under your Dashboard.",
      });
    } else {
      toast.info(`Removed "${name}" from saved circles`);
    }
    if (onBookmarkToggle) onBookmarkToggle(saved);
  };

  const accentIndex = Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % accents.length;
  const gradientAccent = accents[accentIndex];

  return (
    <Link
      to={`/community/${slug}`}
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-[0_24px_50px_hsl(var(--foreground)/0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {/* Top Banner Card Header */}
      <div className={cn("relative flex min-h-32 items-start justify-between bg-gradient-to-br p-5", gradientAccent)}>
        <div className="max-w-[78%]">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
            {category?.name || "Community"}
          </p>
          <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.03em] line-clamp-2 drop-shadow-sm">
            {name}
          </h3>
        </div>

        {/* Quick Save Bookmark Heart */}
        <button
          type="button"
          onClick={handleToggleSave}
          className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/35 active:scale-95"
          aria-label={isSaved ? "Unsave community" : "Save community"}
        >
          <Heart className={cn("h-4 w-4 transition-colors", isSaved ? "fill-rose-400 text-rose-400" : "text-white")} />
        </button>

        {/* Logo Avatar overlapping */}
        <div className="absolute -bottom-5 right-5 z-10">
          {logo_url ? (
            <img
              src={logo_url}
              alt=""
              className="h-14 w-14 rounded-2xl border-2 border-background object-cover shadow-md transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-background bg-primary font-display text-2xl font-bold text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 pt-7">
        {/* Status badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
          {is_verified && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <BadgeCheck className="h-4 w-4" />
              Verified
            </span>
          )}
          {meeting_mode && (
            <Badge variant="outline" className="rounded-full text-[10px] uppercase font-bold tracking-wider">
              {meeting_mode}
            </Badge>
          )}
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground mb-4">
          {short_description}
        </p>

        {/* Footer Meta */}
        <div className="mt-auto space-y-3 border-t border-foreground/10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-foreground/75">
            {(location?.city || location?.state) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {[location.city, location.state].filter(Boolean).join(", ")}
              </span>
            )}
            {!!member_count && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                {member_count.toLocaleString()} members
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex min-w-0 gap-1.5 overflow-hidden">
              {tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag.name}
                  className="truncate rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
              <span>View circle</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
