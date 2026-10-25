import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock,
  ExternalLink,
  Globe2,
  Heart,
  HelpCircle,
  MapPin,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ReportDialog } from "@/components/ReportDialog";
import { ShareModal } from "@/components/ShareModal";
import { EventSchedule } from "@/components/EventSchedule";
import { CommunityCard } from "@/components/CommunityCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { getBreadcrumbStructuredData, getCommunityStructuredData } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { dataStore, type StoreCommunity } from "@/lib/dataStore";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

const CommunityDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<StoreCommunity | null>(null);
  const [relatedCommunities, setRelatedCommunities] = useState<StoreCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const fetchCommunity = useCallback(async () => {
    if (!slug) return;
    setLoading(true);

    let found: StoreCommunity | null = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("communities")
          .select("*, categories(id, name, slug), locations(id, city, state, country), community_tags(tags(name, slug))")
          .eq("slug", slug)
          .single();

        if (!error && data) {
          const rawTags = (data as Record<string, unknown>).community_tags as Array<{ tags?: { name: string; slug: string } }> | undefined;
          const extractedTags = (rawTags?.map((t) => t.tags).filter(Boolean) || []) as Array<{ name: string; slug: string }>;
          found = {
            ...data,
            tags: extractedTags,
            upcoming_events: [],
            faqs: [],
          } as unknown as StoreCommunity;
        }
      } catch {
        // Fallback to dataStore
      }
    }

    if (!found) {
      found = dataStore.getCommunityBySlug(slug);
    }

    if (found) {
      setCommunity(found);
      setIsSaved(dataStore.isSaved(found.id));
      dataStore.recordView(found.id);

      // Fetch related communities
      const related = dataStore
        .getCommunities({ limit: 4 })
        .filter((c) => c.id !== found!.id)
        .slice(0, 3);
      setRelatedCommunities(related);
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    void fetchCommunity();
  }, [fetchCommunity]);

  const handleToggleSave = () => {
    if (!community) return;
    const saved = dataStore.toggleSave(community.id);
    setIsSaved(saved);
    if (saved) {
      toast.success(`Saved "${community.name}" to your space`, {
        description: "You can find your saved communities in your Dashboard.",
      });
    } else {
      toast.info(`Removed "${community.name}" from saved circles`);
    }
  };

  const handleJoinClick = (method: string, url: string) => {
    if (!community) return;
    dataStore.recordJoinClick(community.id, method);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container space-y-5 px-4 py-12 md:px-8">
          <Skeleton className="h-80 rounded-[2.5rem]" />
          <Skeleton className="h-16 w-2/3 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 py-24 text-center md:px-8">
          <RefreshCw className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-5 font-display text-5xl font-bold">This circle is out of view</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            It might be under review, paused, or may have moved to a different address.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button onClick={() => fetchCommunity()} variant="outline" className="rounded-full">
              Try again
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/browse">Explore other communities</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const joinOptions = [
    ["whatsapp", "Join on WhatsApp", community.whatsapp_link],
    ["telegram", "Join on Telegram", community.telegram_link],
    ["discord", "Join on Discord", community.discord_link],
    ["application", "Submit Membership Form", community.application_form_url],
    ["website", "Visit Official Website", community.website_url],
    ["email", "Email Organizer", community.contact_email ? `mailto:${community.contact_email}` : null],
  ].filter((option): option is [string, string, string] => Boolean(option[2]));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getCommunityStructuredData({
        name: community.name,
        description: community.short_description,
        memberCount: community.member_count,
        slug: community.slug,
        location: community.locations
          ? { city: community.locations.city, state: community.locations.state }
          : undefined,
      }),
      getBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Explore", url: "/browse" },
        { name: community.name, url: `/community/${community.slug}` },
      ]),
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${community.name} | Nearloom`}
        description={community.short_description}
        structuredData={structuredData}
      />
      <Navbar />

      <main>
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden border-b border-foreground/10 bg-foreground text-background">
          {community.cover_image_url && (
            <img
              src={community.cover_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
          )}
          <div className="map-grid absolute inset-0 opacity-15" />
          <div className="container relative px-4 py-12 md:px-8 md:py-20">
            <Link
              to="/browse"
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-background/70 hover:text-background transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to explore
            </Link>

            <div className="flex max-w-5xl flex-col gap-8 md:flex-row md:items-end">
              {/* Logo Box */}
              {community.logo_url ? (
                <img
                  src={community.logo_url}
                  alt={`${community.name} logo`}
                  className="h-28 w-28 rounded-[2rem] border-4 border-background/20 object-cover shadow-2xl shrink-0"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-primary font-display text-5xl font-bold text-white shadow-2xl shrink-0">
                  {community.name[0]}
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge className="rounded-full bg-warning text-warning-foreground font-semibold hover:bg-warning">
                    {community.categories?.name || "Community"}
                  </Badge>
                  {community.is_verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/15 px-3 py-1 text-xs font-bold text-background backdrop-blur-sm">
                      <BadgeCheck className="h-4 w-4 text-warning" />
                      Verified Circle
                    </span>
                  )}
                  {community.meeting_mode && (
                    <Badge variant="outline" className="border-background/30 text-background/80 text-xs capitalize">
                      {community.meeting_mode}
                    </Badge>
                  )}
                </div>

                <h1 className="text-balance font-display text-5xl font-bold leading-[0.92] tracking-[-0.05em] md:text-7xl">
                  {community.name}
                </h1>
                <p className="max-w-3xl text-lg leading-7 text-background/80 pt-1">
                  {community.short_description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout Grid */}
        <div className="container grid gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-14">
          {/* Main Left Content */}
          <div className="space-y-10">
            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleToggleSave}
                variant={isSaved ? "default" : "outline"}
                className="rounded-full gap-2 transition-all active:scale-95"
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-white" : ""}`} />
                {isSaved ? "Saved to Space" : "Save Circle"}
              </Button>

              <ShareModal
                communityName={community.name}
                communityDescription={community.short_description}
                slug={community.slug}
              />

              <ReportDialog communityId={community.id} communityName={community.name} />
            </div>

            {/* Interactive Tabs */}
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid h-12 w-full max-w-md grid-cols-3 rounded-2xl bg-secondary p-1">
                <TabsTrigger value="about" className="rounded-xl font-medium">About</TabsTrigger>
                <TabsTrigger value="events" className="rounded-xl font-medium">
                  Gatherings ({community.upcoming_events?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="faq" className="rounded-xl font-medium">Q&A</TabsTrigger>
              </TabsList>

              {/* Tab 1: About & Overview */}
              <TabsContent value="about" className="space-y-8">
                <section>
                  <p className="eyebrow mb-3">Community Story</p>
                  <h2 className="font-display text-3xl font-bold tracking-tight">What to expect here</h2>
                  <div className="mt-4 whitespace-pre-line text-base leading-8 text-foreground/80 font-normal">
                    {community.long_description}
                  </div>
                </section>

                {/* Key Rhythm & Vibe Highlights */}
                <section className="grid overflow-hidden rounded-[2rem] border border-foreground/10 bg-card sm:grid-cols-2">
                  {community.locations && (
                    <div className="border-b border-foreground/10 p-6 sm:border-r">
                      <MapPin className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Based in</p>
                      <p className="mt-1 font-semibold text-base">
                        {[community.locations.city, community.locations.state, community.locations.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}

                  <div className="border-b border-foreground/10 p-6">
                    <Users className="h-5 w-5 text-primary" />
                    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Community Size</p>
                    <p className="mt-1 font-semibold text-base">
                      {community.member_count.toLocaleString()} active members
                    </p>
                  </div>

                  {(community.meeting_frequency || community.typical_meeting_time) && (
                    <div className="border-b border-foreground/10 p-6 sm:border-b-0 sm:border-r">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rhythm & Time</p>
                      <p className="mt-1 font-semibold text-base">
                        {[community.meeting_frequency, community.typical_meeting_time].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  )}

                  {community.languages?.length ? (
                    <div className="p-6">
                      <Globe2 className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Spoken Languages</p>
                      <p className="mt-1 font-semibold text-base">{community.languages.join(", ")}</p>
                    </div>
                  ) : null}
                </section>

                {/* Tags */}
                {community.tags && community.tags.length > 0 && (
                  <section>
                    <h3 className="font-display text-2xl font-semibold mb-3">Interests & Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag) => (
                        <Badge key={tag.name} variant="secondary" className="rounded-full px-4 py-1.5 text-xs font-medium">
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Community Rules */}
                {community.rules && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-display text-2xl font-semibold">Good to know before joining</h3>
                    </div>
                    <div className="rounded-[1.6rem] bg-secondary/60 p-6 text-sm leading-7 text-secondary-foreground whitespace-pre-line border border-foreground/5">
                      {community.rules}
                    </div>
                  </section>
                )}
              </TabsContent>

              {/* Tab 2: Gatherings & Events */}
              <TabsContent value="events" className="space-y-6">
                <div>
                  <p className="eyebrow mb-2">Upcoming Schedule</p>
                  <h2 className="font-display text-3xl font-bold tracking-tight">Gatherings & Meetups</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    RSVP to reserve your spot and receive calendar reminders.
                  </p>
                </div>
                <EventSchedule
                  communityId={community.id}
                  communityName={community.name}
                  events={community.upcoming_events || []}
                />
              </TabsContent>

              {/* Tab 3: Community FAQ */}
              <TabsContent value="faq" className="space-y-6">
                <div>
                  <p className="eyebrow mb-2">Newcomer FAQ</p>
                  <h2 className="font-display text-3xl font-bold tracking-tight">Common Questions</h2>
                </div>
                {community.faqs && community.faqs.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-3">
                    {community.faqs.map((item, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`} className="border border-foreground/10 rounded-2xl px-5 bg-card">
                        <AccordionTrigger className="font-display text-lg font-semibold hover:text-primary">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="rounded-2xl border border-dashed border-foreground/20 p-8 text-center text-sm text-muted-foreground">
                    <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                    No custom questions posted yet. You can contact the organizer directly through their channel.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar: Join Box */}
          <aside>
            <div className="paper-panel sticky top-24 rounded-[2rem] p-6 shadow-xl">
              <p className="eyebrow">Ready When You Are</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight">
                Step into the circle.
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-5">
                You will continue on the platform this community calls home. Nearloom never adds you without your consent.
              </p>

              <div className="mt-6 space-y-3">
                {joinOptions.map(([method, label, url]) => (
                  <Button
                    key={method}
                    onClick={() => handleJoinClick(method, url)}
                    variant={community.primary_join_method === method ? "default" : "outline"}
                    className="h-12 w-full justify-between rounded-xl px-4 font-semibold transition-all active:scale-98"
                  >
                    <span>{label}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
                  </Button>
                ))}

                {joinOptions.length === 0 && (
                  <p className="rounded-xl bg-secondary p-4 text-xs text-muted-foreground">
                    The organizer has not published an open join link yet.
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-start gap-2.5 border-t border-foreground/10 pt-5 text-xs text-muted-foreground leading-5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Verified community channels are tested for active moderation and authentic community standards.</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Communities Carousel Section */}
        {relatedCommunities.length > 0 && (
          <section className="border-t border-foreground/10 bg-card/40 py-16 md:py-20">
            <div className="container px-4 md:px-8">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="eyebrow mb-2"><Sparkles className="h-4 w-4" />Discover More</p>
                  <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                    Similar circles you might like
                  </h2>
                </div>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/browse">View all <ExternalLink className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {relatedCommunities.map((rel) => (
                  <CommunityCard
                    key={rel.id}
                    id={rel.id}
                    name={rel.name}
                    slug={rel.slug}
                    short_description={rel.short_description}
                    logo_url={rel.logo_url}
                    cover_image_url={rel.cover_image_url}
                    category={rel.categories ? { name: rel.categories.name, slug: rel.categories.slug } : undefined}
                    location={rel.locations ? { city: rel.locations.city, state: rel.locations.state } : undefined}
                    member_count={rel.member_count}
                    meeting_mode={rel.meeting_mode}
                    is_verified={rel.is_verified}
                    tags={rel.tags}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default CommunityDetail;
