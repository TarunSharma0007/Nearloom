import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CommunityCard } from "@/components/CommunityCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dataStore, type StoreCommunity } from "@/lib/dataStore";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export const TrendingCommunities = () => {
  const [communities, setCommunities] = useState<StoreCommunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("communities")
          .select("*, categories(name, icon, slug), locations(city, state, country), tags:community_tags(tags(name, slug))")
          .eq("status", "active")
          .order("member_count", { ascending: false, nullsFirst: false })
          .limit(6);

        if (!error && data && data.length > 0) {
          const rawItems = data as unknown as Array<Record<string, unknown>>;
          const formatted = rawItems.map((item) => {
            const rawTags = item.tags as Array<{ tags?: { name: string; slug: string } }> | undefined;
            const extractedTags = (rawTags?.map(({ tags }) => tags).filter(Boolean) || []) as Array<{ name: string; slug: string }>;
            return {
              ...item,
              tags: extractedTags,
              upcoming_events: [],
              faqs: [],
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
      } catch {
        // Fallback to dataStore
      }
    }

    // High availability dataStore
    const featured = dataStore.getCommunities({ limit: 6, sortBy: "popular", status: "active" });
    setCommunities(featured);
    setLoading(false);
  };

  useEffect(() => {
    void fetchCommunities();
    const handleDataChange = () => void fetchCommunities();
    window.addEventListener("nearloom-data-change", handleDataChange);
    return () => window.removeEventListener("nearloom-data-change", handleDataChange);
  }, []);

  return (
    <section className="border-y border-foreground/10 bg-card/55 py-20 md:py-28">
      <div className="container px-4 md:px-8">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4"><Sparkles className="h-4 w-4" />Active Around You</p>
            <h2 className="font-display text-5xl leading-none tracking-[-0.045em] md:text-6xl">
              Circles worth stepping into.
            </h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full bg-transparent">
            <Link to="/browse?sort=popular">
              View all communities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[360px] rounded-[1.6rem]" />
            ))}
          </div>
        )}

        {!loading && communities.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                slug={community.slug}
                short_description={community.short_description}
                logo_url={community.logo_url}
                cover_image_url={community.cover_image_url}
                category={community.categories ? { name: community.categories.name, slug: community.categories.slug || community.categories.name.toLowerCase() } : undefined}
                location={community.locations ? { city: community.locations.city || "", state: community.locations.state || "" } : undefined}
                member_count={community.member_count || 0}
                meeting_mode={community.meeting_mode}
                is_verified={community.is_verified || false}
                tags={community.tags || []}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
