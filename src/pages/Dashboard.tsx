import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Heart,
  MousePointerClick,
  Plus,
  Settings2,
  TrendingUp,
  UserCircle,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CommunityCard } from "@/components/CommunityCard";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataStore, type StoreCommunity, type DemoUser } from "@/lib/dataStore";
import { toast } from "sonner";

const SAMPLE_WEEKLY_ANALYTICS = [
  { day: "Mon", views: 140, clicks: 22 },
  { day: "Tue", views: 210, clicks: 35 },
  { day: "Wed", views: 180, clicks: 28 },
  { day: "Thu", views: 290, clicks: 48 },
  { day: "Fri", views: 340, clicks: 62 },
  { day: "Sat", views: 480, clicks: 94 },
  { day: "Sun", views: 520, clicks: 105 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(dataStore.getCurrentUser());
  const [savedCommunities, setSavedCommunities] = useState<StoreCommunity[]>([]);
  const [myCommunities, setMyCommunities] = useState<Array<StoreCommunity & { role: string }>>([]);
  const [profileName, setProfileName] = useState("");
  const [profileCity, setProfileCity] = useState("");

  const refreshData = () => {
    const user = dataStore.getCurrentUser();
    setCurrentUser(user);
    setProfileName(user?.full_name || "Aarav Sharma");
    setProfileCity(user?.primary_city || "Bengaluru");
    setSavedCommunities(dataStore.getSavedCommunities());
    setMyCommunities(dataStore.getManagedCommunities(user?.id));
  };

  useEffect(() => {
    refreshData();
    const handleSaved = () => setSavedCommunities(dataStore.getSavedCommunities());
    const handleAuth = () => refreshData();
    const handleData = () => refreshData();

    window.addEventListener("nearloom-saved-change", handleSaved);
    window.addEventListener("nearloom-auth-change", handleAuth);
    window.addEventListener("nearloom-data-change", handleData);

    return () => {
      window.removeEventListener("nearloom-saved-change", handleSaved);
      window.removeEventListener("nearloom-auth-change", handleAuth);
      window.removeEventListener("nearloom-data-change", handleData);
    };
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      dataStore.updateCurrentUser({
        full_name: profileName.trim(),
        primary_city: profileCity.trim(),
      });
      toast.success("Profile preferences updated!");
    }
  };

  const totalManagedViews = myCommunities.reduce((acc, c) => acc + (c.member_count * 2.8), 1280);
  const totalManagedClicks = myCommunities.reduce((acc, c) => acc + (c.member_count * 0.42), 245);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Dashboard Header */}
        <section className="map-grid border-b border-foreground/10 bg-card/45">
          <div className="container flex flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-16">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="eyebrow">Your Personal Space</p>
              </div>
              <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
                Welcome, {currentUser?.full_name?.split(" ")[0] || "there"}.
              </h1>
              <p className="text-muted-foreground text-sm max-w-xl">
                Track your saved discoveries, oversee your community listings, and review engagement analytics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => navigate("/create-community")} className="rounded-full shadow-md gap-1.5 font-bold">
                <Plus className="h-4 w-4" /> List a Community
              </Button>
            </div>
          </div>
        </section>

        {/* Dashboard Tabs Content */}
        <section className="container px-4 py-10 md:px-8">
          <Tabs defaultValue="manage" className="space-y-8">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl bg-secondary p-1.5 sm:w-fit">
              <TabsTrigger value="manage" className="rounded-xl px-5 py-2.5 font-semibold gap-2">
                <Settings2 className="h-4 w-4" />
                Organizing ({myCommunities.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-xl px-5 py-2.5 font-semibold gap-2">
                <Heart className="h-4 w-4" />
                Saved Circles ({savedCommunities.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-xl px-5 py-2.5 font-semibold gap-2">
                <BarChart3 className="h-4 w-4" />
                Growth & Insights
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-xl px-5 py-2.5 font-semibold gap-2">
                <UserCircle className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Managed Communities */}
            <TabsContent value="manage" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="eyebrow">Host Dashboard</p>
                  <h2 className="mt-1 font-display text-3xl font-bold">The Circles You Care For</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/create-community")} className="rounded-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Another
                </Button>
              </div>

              {myCommunities.length > 0 ? (
                <div className="space-y-4">
                  {myCommunities.map((comm) => (
                    <article
                      key={comm.id}
                      className="flex flex-col justify-between gap-6 rounded-[2rem] border border-foreground/10 bg-card p-6 shadow-sm md:p-8 transition-all hover:border-foreground/20 hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {comm.logo_url ? (
                            <img src={comm.logo_url} alt="" className="h-16 w-16 rounded-2xl object-cover shrink-0" />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-display text-2xl font-bold shrink-0">
                              {comm.name[0]}
                            </div>
                          )}
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-2xl font-bold">{comm.name}</h3>
                              <Badge
                                variant={comm.status === "active" ? "default" : "secondary"}
                                className="rounded-full capitalize text-[10px]"
                              >
                                {comm.status === "active" ? (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-300" /> Active & Listed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-amber-500" /> Pending Review
                                  </span>
                                )}
                              </Badge>
                              <Badge variant="outline" className="rounded-full text-[10px] capitalize">
                                {comm.role}
                              </Badge>
                            </div>
                            <p className="max-w-2xl text-xs text-muted-foreground leading-relaxed">
                              {comm.short_description}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full shrink-0"
                          onClick={() => navigate(`/community/${comm.slug}`)}
                        >
                          View Live Listing <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Mini Metric row */}
                      <div className="grid grid-cols-3 gap-3 border-t border-foreground/10 pt-4 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-xl bg-primary/10 p-2 text-primary"><Eye className="h-4 w-4" /></span>
                          <div>
                            <p className="font-bold text-sm">{(comm.member_count * 2.4).toFixed(0)}</p>
                            <p className="text-[11px] text-muted-foreground">Listing Views</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600"><MousePointerClick className="h-4 w-4" /></span>
                          <div>
                            <p className="font-bold text-sm">{(comm.member_count * 0.35).toFixed(0)}</p>
                            <p className="text-[11px] text-muted-foreground">Join Clicks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-xl bg-amber-500/10 p-2 text-amber-600"><Users className="h-4 w-4" /></span>
                          <div>
                            <p className="font-bold text-sm">{comm.member_count.toLocaleString()}</p>
                            <p className="text-[11px] text-muted-foreground">Members</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="map-grid rounded-[2rem] border border-dashed border-foreground/20 p-12 text-center">
                  <Users className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 font-display text-2xl font-bold">You haven't listed a community yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Bring your club, running group, or maker collective to Nearloom and help curious local people step in.
                  </p>
                  <Button onClick={() => navigate("/create-community")} className="mt-6 rounded-full">
                    List Your Community
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Saved Communities */}
            <TabsContent value="saved" className="space-y-6">
              <div>
                <p className="eyebrow">Your Shortlist</p>
                <h2 className="mt-1 font-display text-3xl font-bold">Communities You Saved</h2>
              </div>

              {savedCommunities.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {savedCommunities.map((comm) => (
                    <CommunityCard
                      key={comm.id}
                      id={comm.id}
                      name={comm.name}
                      slug={comm.slug}
                      short_description={comm.short_description}
                      logo_url={comm.logo_url}
                      cover_image_url={comm.cover_image_url}
                      category={comm.categories ? { name: comm.categories.name, slug: comm.categories.slug } : undefined}
                      location={comm.locations ? { city: comm.locations.city, state: comm.locations.state } : undefined}
                      member_count={comm.member_count}
                      meeting_mode={comm.meeting_mode}
                      is_verified={comm.is_verified}
                      tags={comm.tags}
                    />
                  ))}
                </div>
              ) : (
                <div className="map-grid rounded-[2rem] border border-dashed border-foreground/20 p-12 text-center">
                  <Heart className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 font-display text-2xl font-bold">No saved circles yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    When you find an intriguing community in the directory, tap the heart icon to save it here for later.
                  </p>
                  <Button onClick={() => navigate("/browse")} className="mt-6 rounded-full">
                    Explore Communities
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Tab 3: Interactive Recharts Analytics */}
            <TabsContent value="analytics" className="space-y-8">
              <div>
                <p className="eyebrow">Real-Time Performance</p>
                <h2 className="mt-1 font-display text-3xl font-bold">Engagement Trends</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover how many people viewed your listings and clicked to join your channels this week.
                </p>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card className="rounded-[1.6rem] border-foreground/10 p-6 bg-card">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Views</p>
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-4 font-display text-4xl font-bold">{totalManagedViews.toLocaleString()}</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +18.4% from last week
                  </p>
                </Card>

                <Card className="rounded-[1.6rem] border-foreground/10 p-6 bg-card">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Join Clicks</p>
                    <MousePointerClick className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-4 font-display text-4xl font-bold">{totalManagedClicks.toLocaleString()}</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +24.1% conversion rate
                  </p>
                </Card>

                <Card className="rounded-[1.6rem] border-foreground/10 p-6 bg-card">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Managed Circles</p>
                    <Users className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="mt-4 font-display text-4xl font-bold">{myCommunities.length}</p>
                  <p className="mt-2 text-xs text-muted-foreground">All verified & active</p>
                </Card>
              </div>

              {/* Interactive Area Chart */}
              <Card className="rounded-[2rem] border-foreground/10 p-6 md:p-8 bg-card shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold">7-Day Traffic & Discovery</h3>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-primary" /> Listing Views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" /> Join Clicks
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SAMPLE_WEEKLY_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--foreground)/0.1)",
                          borderRadius: "1rem",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            {/* Tab 4: Profile & Preferences */}
            <TabsContent value="profile" className="space-y-6">
              <div className="max-w-2xl">
                <div>
                  <p className="eyebrow">Account Settings</p>
                  <h2 className="mt-1 font-display text-3xl font-bold">Your Profile & Preferences</h2>
                </div>

                <Card className="mt-6 rounded-[2rem] border-foreground/10 p-6 md:p-8 bg-card shadow-sm">
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <Label htmlFor="prof-name" className="text-sm font-semibold">Full Name</Label>
                      <Input
                        id="prof-name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="prof-email" className="text-sm font-semibold">Email</Label>
                      <Input
                        id="prof-email"
                        value={currentUser?.email || "user@nearloom.app"}
                        readOnly
                        className="mt-1.5 h-12 rounded-xl bg-secondary/50 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prof-city" className="text-sm font-semibold">Primary City / Region</Label>
                      <Input
                        id="prof-city"
                        value={profileCity}
                        onChange={(e) => setProfileCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="mt-1.5 h-12 rounded-xl"
                      />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="rounded-full px-6 font-semibold">
                        Save Profile Changes
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Dashboard;
