import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  initialLocation?: string;
  onSearch?: (query: string, location?: string) => void;
  className?: string;
  showLocationPicker?: boolean;
}

export const SearchBar = ({
  placeholder = "Try ‘weekend cycling’ or ‘product design’",
  initialQuery = "",
  initialLocation = "",
  onSearch,
  className,
  showLocationPicker = true,
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query.trim(), location.trim() || undefined);
      return;
    }
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/browse${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <div
      className={cn(
        "paper-panel flex flex-col gap-2 rounded-[1.35rem] p-2 sm:flex-row sm:items-center",
        className,
      )}
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">What are you interested in?</span>
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
          placeholder={placeholder}
          className="h-14 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0"
        />
      </label>
      {showLocationPicker && (
        <label className="relative min-w-0 flex-1 border-t border-foreground/10 sm:border-l sm:border-t-0">
          <span className="sr-only">City or area</span>
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground sm:left-5" />
          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
            placeholder="City or area"
            className="h-14 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0 sm:pl-13"
          />
        </label>
      )}
      <Button onClick={handleSearch} size="lg" className="h-14 rounded-2xl px-6" aria-label="Search communities">
        Explore <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
