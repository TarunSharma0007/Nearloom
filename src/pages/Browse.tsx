import { useCallback, useEffect, useState } from "react";
import {
  Compass,
  Grid,
  List as ListIcon,
  Map as MapIcon,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { CommunityCard } from "@/components/CommunityCard";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { getBreadcrumbStructuredData } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveMap } from "@/components/InteractiveMap";
import { dataStore, type StoreCommunity } from "@/lib/dataStore";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

interface Category { id: string; name: string; slug: string }
interface Location { id: string; city: string | null; state: string | null; country: string }

type ViewMode = "grid" | "list" | "map";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [communities, setCommunities] = useState<StoreCommunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const searchQuery = searchParams.get("q") || "";
  const locationText = searchParams.get("location") || "";
  const category = searchParams.get("category") || "all";
  const locationId = searchParams.get("locationId") || "all";
  const mode = searchParams.get("mode") || "all";
  const sortBy = (searchParams.get("sort") as "newest" | "popular" | "active") || "newest";

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  useEffect(() => {
    // Categories and locations
    const cats = dataStore.getCategories();
    const locs = dataStore.getLocations();
    setCategories(cats);
    setLocations(locs);
  }, []);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from("communities")
          .select("id, name, slug, short_description, long_description, logo_url, cover_image_url, member_count, meeting_mode, is_verified, category_id, location_id, created_at, last_activity_at, categories(name, slug), locations(city, state), community_tags(tags(name))")
          .eq("status", "active");

        const cleanSearch = searchQuery.replace(/[%_,()]/g, " ").trim();
        if (cleanSearch) query = query.or(`name.ilike.%${cleanSearch}%,short_description.ilike.%${cleanSearch}%`);
        if (category !== "all") {
          const match = categories.find((item) => item.slug === category);
          if (match) query = query.eq("category_id", match.id);
        }
        if (locationId !== "all") query = query.eq("location_id", locationId);
        if (mode !== "all") query = query.eq("meeting_mode", mode);

        if (sortBy === "popular") query = query.order("member_count", { ascending: false, nullsFirst: false });
        else if (sortBy === "active") query = query.order("last_activity_at", { ascending: false, nullsFirst: false });
        else query = query.order("created_at", { ascending: false });

        const { data, error } = await query.limit(40);
        if (!error && data && data.length > 0) {
          // Format for component
          const rawItems = data as unknown as Array<Record<string, unknown>>;
          const formatted = rawItems.map((item) => {
            const rawTags = item.community_tags as Array<{ tags?: { name?: string } | null }> | undefined;
            const tags = (rawTags?.map((t) => ({ name: t.tags?.name || "", slug: "" })).filter((t) => Boolean(t.name)) || []) as Array<{ name: string; slug: string }>;
            return {
              ...item,
              tags,
              upcoming_events: [],
              faqs: [],
              meeting_frequency: "",
              typical_meeting_time: "",
              languages: ["English"],
              rules: "",
              primary_join_method: "whatsapp" as const,
              status: "active" as const,
              created_by: "",
            };
          });
          setCommunities(formatted as unknown as StoreCommunity[]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to dataStore:", err);
      }
    }

    // Resilient fallback to high-availability dataStore
    const results = dataStore.getCommunities({
      query: searchQuery,
      locationText,
      category,
      locationId,
      mode,
      sortBy,
      status: "active",
    });

    setCommunities(results);
    setLoading(false);
  }, [searchQuery, category, categories, locationId, mode, sortBy, locationText]);

  useEffect(() => {
    void fetchCommunities();
    const handleDataChange = () => void fetchCommunities();
    window.addEventListener("nearloom-data-change", handleDataChange);
    return () => window.removeEventListener("nearloom-data-change", handleDataChange);
  }, [fetchCommunities]);

  const hasFilters = Boolean(searchQuery || locationText || category !== "all" || locationId !== "all" || mode !== "all");

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Explore Communities | Nearloom"
        description="Find trusted local communities by interest, city, meeting style, and activity."
        structuredData={getBreadcrumbStructuredData([{ name: "Home", url: "/" }, { name: "Explore", url: "/browse" }])}
      />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="map-grid border-b border-foreground/10 bg-card/45">
          <div className="container px-4 py-12 md:px-8 md:py-16">
            <p className="eyebrow mb-4"><Compass className="h-4 w-4" />Community Directory</p>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.05em] md:text-7xl">
                  Find your crowd.
                </h1>
                <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
                  Discover verified groups across interests and cities, then step directly into the platforms they gather on.
                </p>
              </div>
              <SearchBar
                key={searchQuery}
                initialQuery={searchQuery}
                onSearch={(query) => updateParam("q", query)}
                showLocationPicker={false}
                className="w-full lg:max-w-xl"
              />
            </div>

            {/* Category Quick Chips */}
            <div className="mt-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
              <Button
                variant={category === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => updateParam("category", "all")}
                className="rounded-full text-xs font-semibold"
              >
                All Interests
              </Button>
              {categories.map((item) => (
                <Button
                  key={item.id}
                  variant={category === item.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateParam("category", item.slug)}
                  className="rounded-full text-xs font-semibold"
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Directory Controls & Content */}
        <section className="container px-4 py-8 md:px-8">
          {/* Secondary Refinement Bar */}
          <div className="paper-panel mb-8 grid gap-3 rounded-[1.4rem] p-3 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr] lg:items-center">
            <span className="hidden items-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground lg:flex">
              <SlidersHorizontal className="h-4 w-4" />Filters
            </span>

            <Select value={category} onValueChange={(value) => updateParam("category", value)}>
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <SelectValue placeholder="Interest Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Interests</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.slug}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationId} onValueChange={(value) => updateParam("locationId", value)}>
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <SelectValue placeholder="City or Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Location</SelectItem>
                {locations.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {[item.city, item.state || item.country].filter(Boolean).join(", ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={mode} onValueChange={(value) => updateParam("mode", value)}>
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <SelectValue placeholder="Meeting Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Format</SelectItem>
                <SelectItem value="offline">In Person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary Bar & View Mode Toggle */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">
                {loading ? "Searching..." : `${communities.length} ${communities.length === 1 ? "community" : "communities"}`}
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="rounded-full">
                  "{searchQuery}"
                  <button onClick={() => updateParam("q")} className="ml-1.5" aria-label="Clear search">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {category !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {categories.find((c) => c.slug === category)?.name}
                  <button onClick={() => updateParam("category", "all")} className="ml-1.5" aria-label="Clear category">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {hasFilters && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-xs font-semibold text-primary underline-offset-4 hover:underline ml-2"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-full border border-foreground/15 bg-card p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 rounded-full px-3 text-xs gap-1.5"
                  aria-label="Grid view"
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 rounded-full px-3 text-xs gap-1.5"
                  aria-label="List view"
                >
                  <ListIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">List</span>
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="h-8 rounded-full px-3 text-xs gap-1.5"
                  aria-label="Radar Map view"
                >
                  <MapIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Map</span>
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value) => updateParam("sort", value)}>
                <SelectTrigger className="w-40 rounded-full h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Recently Added</SelectItem>
                  <SelectItem value="popular">Largest First</SelectItem>
                  <SelectItem value="active">Recently Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[360px] rounded-[1.6rem]" />
              ))}
            </div>
          )}

          {/* Map View Mode */}
          {!loading && viewMode === "map" && (
            <InteractiveMap
              communities={communities}
              onSelectCity={(cityName) => {
                if (cityName) updateParam("location", cityName);
                else updateParam("location", "");
              }}
              selectedCity={locationText}
            />
          )}

          {/* Grid View Mode */}
          {!loading && viewMode === "grid" && communities.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {communities.map((item) => (
                <CommunityCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  slug={item.slug}
                  short_description={item.short_description}
                  logo_url={item.logo_url}
                  cover_image_url={item.cover_image_url}
                  category={item.categories ? { name: item.categories.name, slug: item.categories.slug } : undefined}
                  location={item.locations ? { city: item.locations.city || "", state: item.locations.state || "" } : undefined}
                  member_count={item.member_count || 0}
                  meeting_mode={item.meeting_mode}
                  is_verified={item.is_verified || false}
                  tags={item.tags || []}
                />
              ))}
            </div>
          )}

          {/* List View Mode */}
          {!loading && viewMode === "list" && communities.length > 0 && (
            <div className="space-y-3">
              {communities.map((comm) => (
                <Link
                  key={comm.id}
                  to={`/community/${comm.slug}`}
                  className="group flex flex-col justify-between gap-4 rounded-[1.4rem] border border-foreground/10 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    {comm.logo_url ? (
                      <img
                        src={comm.logo_url}
                        alt=""
                        className="h-14 w-14 rounded-2xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 font-display text-2xl font-bold text-primary shrink-0">
                        {comm.name[0]}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                          {comm.name}
                        </h3>
                        {comm.is_verified && (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Verified
                          </span>
                        )}
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                          {comm.meeting_mode}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {comm.short_description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/70 pt-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          {comm.locations?.city || "Global"}
                        </span>
                        <span>{comm.member_count} members</span>
                        {comm.meeting_frequency && <span>· {comm.meeting_frequency}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <Button variant="outline" size="sm" className="rounded-full text-xs">
                      View details
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && communities.length === 0 && (
            <div className="map-grid rounded-[2rem] border border-dashed border-foreground/20 py-20 text-center">
              <Compass className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold">No exact match found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                Try widening your search terms or picking another category. You can also be the first to start a circle here.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={() => setSearchParams({})} variant="outline" className="rounded-full">
                  Reset filters
                </Button>
                <Button asChild className="rounded-full">
                  <Link to="/create-community">List your community</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Browse;
