import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  HeartHandshake,
  MapPin,
  Music2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { SiteFooter } from "@/components/SiteFooter";
import { TrendingCommunities } from "@/components/TrendingCommunities";
import { SEO } from "@/components/SEO";
import { getOrganizationStructuredData, getWebsiteStructuredData } from "@/lib/seo";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Tech & makers", slug: "technology", icon: Code2, tone: "from-[#d95d3f] to-[#c44d30] text-white" },
  { name: "Sports & outdoors", slug: "sports", icon: Bike, tone: "from-[#2a6b48] to-[#1e5035] text-white" },
  { name: "Arts & culture", slug: "arts", icon: Music2, tone: "from-[#e8b94e] to-[#d4a53c] text-[#17231f]" },
  { name: "Learning circles", slug: "education", icon: BookOpen, tone: "from-[#2e6580] to-[#1f4d65] text-white" },
  { name: "Causes & care", slug: "social", icon: HeartHandshake, tone: "from-[#a94d66] to-[#8f3d54] text-white" },
  { name: "Career & business", slug: "professional", icon: BriefcaseBusiness, tone: "from-[#635347] to-[#4d3f35] text-white" },
];

const stats = [
  { value: "2,400+", label: "Local circles", icon: Users },
  { value: "8 Cities", label: "And growing", icon: Globe },
  { value: "12K+", label: "Members connected", icon: Zap },
];

const Index = () => (
  <div className="min-h-screen overflow-hidden bg-background">
    <SEO
      title="Nearloom — Find communities that feel close"
      description="Discover trusted local communities, clubs, and collectives. Search by interest, place, language, or how you like to meet."
      structuredData={{ "@context": "https://schema.org", "@graph": [getWebsiteStructuredData(), getOrganizationStructuredData()] }}
    />
    <Navbar />

    <main>
      {/* ── Hero Section ── */}
      <section className="relative border-b border-foreground/10">
        <div className="gradient-mesh absolute inset-0" />
        <div className="map-grid absolute inset-0 opacity-40" />
        <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-warning/25 blur-[100px]" />
        <div className="absolute -left-20 bottom-20 h-60 w-60 rounded-full bg-primary/15 blur-[80px]" />
        <div className="container relative grid min-h-[720px] items-center gap-14 px-4 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl animate-soft-reveal">
            <p className="eyebrow mb-7"><Sparkles className="h-4 w-4" />A better way to belong</p>
            <h1 className="text-balance font-display text-fluid-hero font-medium leading-[0.82] tracking-display-tight">
              Find your <span className="italic text-gradient">people,</span><br />nearby.
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
              From Sunday cyclists to first-time founders, discover real communities built around the things you care about.
            </p>
            <SearchBar className="mt-9 max-w-3xl" />
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="text-foreground">Explore:</span>
              {[
                ["Book clubs", "books"],
                ["Weekend hikes", "hiking"],
                ["Startup circles", "startups"],
              ].map(([label, query]) => <Link key={query} to={`/browse?q=${query}`} className="border-b border-foreground/30 pb-0.5 transition-colors hover:border-primary hover:text-primary">{label}</Link>)}
            </div>
          </div>

          {/* Hero Illustration Cards */}
          <div className="relative mx-auto hidden h-[520px] w-full max-w-[500px] lg:block" aria-hidden="true">
            <div className="dot-field absolute inset-8 rotate-3 rounded-[3rem] border border-foreground/10 bg-card/40" />
            <div className="glass-card absolute left-0 top-14 w-[290px] -rotate-3 rounded-[2rem] p-5 animate-soft-reveal [animation-delay:160ms]">
              <div className="mb-16 flex items-start justify-between">
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">Meeting this week</span>
                <Bike className="h-7 w-7 text-accent" />
              </div>
              <p className="font-display text-3xl leading-none">Cubbon Sunday Riders</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />Bengaluru · 6 km away</p>
            </div>

            {/* Stats Badge */}
            <div className="absolute right-0 top-2 flex h-36 w-36 rotate-6 flex-col items-center justify-center rounded-full gradient-primary text-white shadow-xl animate-soft-reveal [animation-delay:300ms]">
              <Users className="mb-1 h-6 w-6" />
              <span className="font-display text-3xl leading-none">2,400+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">local circles</span>
            </div>

            {/* Trust Card */}
            <div className="absolute bottom-7 right-2 w-[300px] rotate-2 rounded-[2rem] bg-foreground p-6 text-background shadow-2xl animate-soft-reveal [animation-delay:450ms]">
              <div className="flex items-center justify-between text-xs text-background/60"><span>Community signal</span><BadgeCheck className="h-5 w-5 text-warning" /></div>
              <p className="mt-10 font-display text-3xl leading-tight">Verified hosts.<br />Clear ways to join.</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-background/15">
                <div className="h-full w-4/5 rounded-full gradient-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-foreground/10 bg-foreground/[0.02]">
        <div className="container grid grid-cols-3 divide-x divide-foreground/10 px-4 py-8 md:px-8 md:py-10">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon className="h-5 w-5 text-primary mb-1" />
              <p className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{value}</p>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section className="container px-4 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Start with what moves you</p>
            <h2 className="font-display text-fluid-5xl leading-none tracking-display">Explore your kind of crowd.</h2>
          </div>
          <Button asChild variant="ghost" className="w-fit rounded-full"><Link to="/browse">See everything <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/browse?category=${category.slug}`}
              className={`bg-gradient-to-br ${category.tone} group flex min-h-44 items-end justify-between rounded-[1.6rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">0{index + 1}</span>
                <h3 className="mt-8 font-display text-3xl leading-none tracking-heading">{category.name}</h3>
              </div>
              <category.icon className="h-8 w-8 transition-transform group-hover:rotate-6 group-hover:scale-110" />
            </Link>
          ))}
        </div>
      </section>

      <TrendingCommunities />

      {/* ── Value Proposition ── */}
      <section className="container px-4 py-20 md:px-8 md:py-28">
        <div className="overflow-hidden rounded-[2.5rem] bg-foreground text-background">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-14 lg:p-16">
              <p className="eyebrow text-warning">No feed. No noise.</p>
              <h2 className="mt-6 font-display text-fluid-5xl leading-[0.95] tracking-display">Just a clearer path from curious to connected.</h2>
            </div>
            <div className="grid border-t border-background/15 lg:border-l lg:border-t-0">
              {[
                [MapPin, "Discover locally", "Search by city, neighborhood, interest, language, and meeting style."],
                [ShieldCheck, "Choose with confidence", "See verified hosts, current activity, rules, and the exact way to join."],
                [HeartHandshake, "Connect where you already are", "Nearloom points you to the community's real home — online or offline."],
              ].map(([Icon, title, copy]) => {
                const FeatureIcon = Icon as typeof MapPin;
                return (
                  <div key={title as string} className="grid grid-cols-[auto_1fr] gap-5 border-b border-background/15 p-7 last:border-b-0 md:p-9 transition-colors hover:bg-background/[0.03]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15">
                      <FeatureIcon className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title as string}</h3>
                      <p className="mt-2 text-sm leading-6 text-background/60">{copy as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA for Organizers ── */}
      <section className="container px-4 pb-10 md:px-8 md:pb-20">
        <div className="gradient-mesh relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-foreground/10 px-6 py-20 text-center">
          <div className="absolute inset-0 map-grid opacity-30" />
          <div className="relative">
            <p className="eyebrow">For organizers</p>
            <h2 className="mt-5 max-w-3xl text-balance font-display text-fluid-5xl leading-none tracking-display">Your community deserves to be found.</h2>
            <p className="mt-6 max-w-xl mx-auto text-muted-foreground">Create a trusted listing, reach the right people, and understand what helps them take the next step.</p>
            <Button asChild size="lg" className="mt-8 rounded-full px-7 gradient-primary text-white border-0 shadow-sm hover:opacity-90 transition-opacity">
              <Link to="/create-community">List your community <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Index;
