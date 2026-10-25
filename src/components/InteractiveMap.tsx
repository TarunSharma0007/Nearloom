import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Users, Globe, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StoreCommunity } from "@/lib/dataStore";

interface InteractiveMapProps {
  communities: StoreCommunity[];
  onSelectCity?: (city: string) => void;
  selectedCity?: string;
}

interface CityCluster {
  name: string;
  country: string;
  x: number; // percentage on SVG
  y: number;
  count: number;
}

const CITY_COORDINATES: Record<string, { x: number; y: number }> = {
  "Bengaluru": { x: 68, y: 58 },
  "Mumbai": { x: 65, y: 54 },
  "Delhi NCR": { x: 67, y: 46 },
  "Pune": { x: 66, y: 56 },
  "Hyderabad": { x: 69, y: 55 },
  "London": { x: 48, y: 32 },
  "San Francisco": { x: 19, y: 39 },
  "Berlin": { x: 52, y: 31 },
};

export const InteractiveMap = ({
  communities,
  onSelectCity,
  selectedCity,
}: InteractiveMapProps) => {
  const [activeCity, setActiveCity] = useState<string>(selectedCity || "Bengaluru");

  // Calculate city clusters from available communities
  const clusters: CityCluster[] = Object.entries(CITY_COORDINATES).map(([cityName, coords]) => {
    const matching = communities.filter((c) => c.locations?.city.toLowerCase() === cityName.toLowerCase());
    return {
      name: cityName,
      country: matching[0]?.locations?.country || "Global",
      x: coords.x,
      y: coords.y,
      count: matching.length,
    };
  }).filter((cluster) => cluster.count > 0);

  const activeCommunities = communities.filter(
    (c) => !activeCity || c.locations?.city.toLowerCase() === activeCity.toLowerCase()
  );

  const handleCityClick = (city: string) => {
    setActiveCity(city);
    if (onSelectCity) onSelectCity(city);
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-card shadow-[0_24px_60px_hsl(var(--foreground)/0.06)]">
      {/* Top Map Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-foreground/10 p-5 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Live Radar</p>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Active Community Hubs</h2>
        </div>

        {/* City Filter Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-0">
          <Button
            variant={!activeCity ? "default" : "outline"}
            size="sm"
            onClick={() => handleCityClick("")}
            className="rounded-full text-xs"
          >
            All Cities ({communities.length})
          </Button>
          {clusters.map((cluster) => (
            <Button
              key={cluster.name}
              variant={activeCity === cluster.name ? "default" : "outline"}
              size="sm"
              onClick={() => handleCityClick(cluster.name)}
              className="rounded-full text-xs"
            >
              <MapPin className="mr-1 h-3 w-3" />
              {cluster.name} ({cluster.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Visual Interactive Map Canvas */}
      <div className="relative h-72 w-full overflow-hidden bg-foreground/[0.03] dark:bg-foreground/[0.05] sm:h-96">
        {/* Subtle Map Grid Lines */}
        <div className="map-grid absolute inset-0 opacity-40" />

        {/* Ambient Radar Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_52%,hsl(var(--primary)/0.12),transparent_45%)]" />

        {/* Stylized Minimal World Outline SVG */}
        <svg
          viewBox="0 0 1000 500"
          className="h-full w-full object-cover opacity-25 dark:opacity-20"
          aria-hidden="true"
        >
          {/* North America */}
          <path
            d="M 120,120 Q 200,80 280,110 Q 260,180 230,220 Q 180,260 150,220 Z"
            fill="currentColor"
          />
          {/* South America */}
          <path
            d="M 270,250 Q 320,290 300,380 Q 260,420 240,360 Z"
            fill="currentColor"
          />
          {/* Europe */}
          <path
            d="M 460,90 Q 540,80 550,140 Q 490,170 460,140 Z"
            fill="currentColor"
          />
          {/* Africa */}
          <path
            d="M 470,180 Q 560,190 540,320 Q 480,350 460,260 Z"
            fill="currentColor"
          />
          {/* Asia & India */}
          <path
            d="M 570,100 Q 750,90 780,220 Q 690,290 640,240 Q 620,180 570,150 Z"
            fill="currentColor"
          />
          {/* Australia */}
          <path
            d="M 760,330 Q 840,320 830,390 Q 760,410 740,360 Z"
            fill="currentColor"
          />
        </svg>

        {/* Interactive Radar Pins on the Map */}
        {clusters.map((cluster) => {
          const isSelected = activeCity === cluster.name;
          return (
            <button
              key={cluster.name}
              type="button"
              onClick={() => handleCityClick(cluster.name)}
              style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 focus:outline-none"
            >
              {/* Pulse animation ring */}
              <span className={`absolute -inset-2 rounded-full transition-opacity duration-300 ${isSelected ? "animate-ping bg-primary/40 opacity-100" : "bg-primary/20 opacity-0 group-hover:opacity-75"}`} />

              {/* Pin body */}
              <div
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-md transition-all duration-300 ${
                  isSelected
                    ? "scale-110 bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-card text-foreground hover:scale-105 border border-foreground/15"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{cluster.name}</span>
                <span className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${isSelected ? "bg-white/20 text-white" : "bg-secondary text-secondary-foreground"}`}>
                  {cluster.count}
                </span>
              </div>
            </button>
          );
        })}

        {/* Bottom Status Overlay */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2 rounded-full border border-foreground/10 bg-card/85 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span>Click any city pin to filter communities</span>
        </div>
      </div>

      {/* Preview Section: Circles in Selected City */}
      <div className="border-t border-foreground/10 bg-card/50 p-5 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold">
              {activeCity ? `Communities in ${activeCity}` : "Featured Communities Worldwide"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Showing {activeCommunities.length} active circles ready for you to join
            </p>
          </div>
          {activeCity && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCityClick("")}
              className="text-xs text-primary"
            >
              Show all locations
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeCommunities.slice(0, 3).map((comm) => (
            <Link
              key={comm.id}
              to={`/community/${comm.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {comm.logo_url ? (
                      <img
                        src={comm.logo_url}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                        {comm.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                        {comm.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {comm.locations?.city} · {comm.member_count} members
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">
                    {comm.meeting_mode}
                  </Badge>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {comm.short_description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3 text-xs font-semibold text-primary">
                <span>View circle</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
