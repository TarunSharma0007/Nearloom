import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  HelpCircle,
  Image as ImageIcon,
  Sparkles,
  Upload,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { CommunityCard } from "@/components/CommunityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { dataStore, type StoreCategory, type StoreLocation } from "@/lib/dataStore";
import { toast } from "sonner";

const PHOTO_PRESETS = [
  { label: "Cycling & Outdoors", url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80" },
  { label: "Tech & Coding", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80" },
  { label: "Acoustic Music", url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80" },
  { label: "Books & Study", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80" },
  { label: "Coffee & Dining", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80" },
  { label: "Yoga & Wellness", url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80" },
  { label: "Design & Creative", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80" },
  { label: "Nature & Green", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80" },
];

const SUGGESTED_TAGS = [
  "Beginner Friendly", "Weekend Meetups", "Open Source", "Networking", "Fitness",
  "Workshops", "Creative", "Discussion", "Volunteering", "Peer Mentorship"
];

const DRAFT_STORAGE_KEY = "nearloom_create_community_draft";

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [customTag, setCustomTag] = useState("");

  const [formData, setFormData] = useState({
    name: "Bengaluru Board Game Guild",
    short_description: "Tabletop enthusiasts meeting every alternate Saturday for Eurogames, social deduction, and strategy board games.",
    long_description: `We believe in the timeless magic of unplugging from digital screens and gathering around cardboard and wooden meeples.\n\nWhether you love heavy worker-placement games like Brass: Birmingham, fast-paced deckbuilders like Dune: Imperium, or casual party games like Codenames, you will find eager opponents and friendly teachers here.\n\nAll skill levels welcome. We teach rules before every game starts!`,
    category_id: "cat-3",
    location_id: "loc-1",
    meeting_mode: "offline" as "offline" | "online" | "hybrid",
    meeting_frequency: "Every alternate Saturday 4:00 PM",
    typical_meeting_time: "Saturday afternoons",
    languages: ["English", "Hindi"],
    member_count: "85",
    rules: "1. Treat game components with gentle respect.\n2. We teach rules patiently—no sore losers or gloating.\n3. Keep drinks in capped bottles away from card decks.",
    primary_join_method: "whatsapp" as "whatsapp" | "telegram" | "discord" | "website" | "email",
    whatsapp_link: "https://chat.whatsapp.com/BoardGameGuildExample",
    telegram_link: "",
    discord_link: "",
    website_url: "",
    contact_email: "organizer@boardgames-blr.org",
    cover_image_url: PHOTO_PRESETS[4].url,
    selectedTags: ["Weekend Meetups", "Beginner Friendly", "Creative"],
  });

  useEffect(() => {
    setCategories(dataStore.getCategories());
    setLocations(dataStore.getLocations());

    // Try restoring draft
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch {
      // Keep defaults
    }
  }, []);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // LocalStorage quota exceeded or private browsing restricted
      }
      return next;
    });
  };

  const handleToggleTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.selectedTags.includes(tag);
      const updated = exists ? prev.selectedTags.filter((t) => t !== tag) : [...prev.selectedTags, tag];
      return { ...prev, selectedTags: updated };
    });
  };

  const handleAddCustomTag = () => {
    if (!customTag.trim()) return;
    if (!formData.selectedTags.includes(customTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        selectedTags: [...prev.selectedTags, customTag.trim()],
      }));
    }
    setCustomTag("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.length < 4) {
      toast.error("Please enter a valid community name (at least 4 characters)");
      setStep(1);
      return;
    }
    if (!formData.short_description.trim() || formData.short_description.length < 20) {
      toast.error("Please write a short description (at least 20 characters)");
      setStep(1);
      return;
    }
    if (!formData.contact_email.trim() || !formData.contact_email.includes("@")) {
      toast.error("Please provide a valid contact email address");
      setStep(3);
      return;
    }

    const created = dataStore.addCommunity({
      name: formData.name.trim(),
      short_description: formData.short_description.trim(),
      long_description: formData.long_description.trim(),
      category_id: formData.category_id || categories[0]?.id || "cat-1",
      location_id: formData.location_id || locations[0]?.id || "loc-1",
      meeting_mode: formData.meeting_mode,
      meeting_frequency: formData.meeting_frequency.trim(),
      typical_meeting_time: formData.typical_meeting_time.trim(),
      languages: formData.languages,
      member_count: parseInt(formData.member_count) || 25,
      rules: formData.rules.trim(),
      primary_join_method: formData.primary_join_method,
      whatsapp_link: formData.whatsapp_link.trim() || undefined,
      telegram_link: formData.telegram_link.trim() || undefined,
      discord_link: formData.discord_link.trim() || undefined,
      website_url: formData.website_url.trim() || undefined,
      contact_email: formData.contact_email.trim(),
      tags: formData.selectedTags,
      cover_image_url: formData.cover_image_url,
    });

    localStorage.removeItem(DRAFT_STORAGE_KEY);

    toast.success("Community submitted for review!", {
      description: `"${created.name}" is now visible in your Organizer Space and pending platform approval.`,
    });

    navigate("/dashboard");
  };

  const selectedCategoryObj = categories.find((c) => c.id === formData.category_id);
  const selectedLocationObj = locations.find((l) => l.id === formData.location_id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Header Banner */}
        <section className="map-grid border-b border-foreground/10 bg-card/45">
          <div className="container max-w-6xl px-4 py-12 md:px-8 md:py-16">
            <p className="eyebrow"><Sparkles className="h-4 w-4" />Organizer Onboarding</p>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-7xl">
              Bring your circle into view.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              Create a trusted, structured listing so people in your city can easily find and join what you have built.
            </p>
          </div>
        </section>

        {/* Form & Live Preview Split Screen */}
        <section className="container max-w-6xl px-4 py-10 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            {/* Left Side: Step Form */}
            <Card className="rounded-[2rem] border-foreground/10 p-6 md:p-8 shadow-xl bg-card">
              {/* Stepper Header */}
              <div className="mb-8 flex items-center justify-between border-b border-foreground/10 pb-5">
                {[
                  { stepNum: 1, label: "Basics" },
                  { stepNum: 2, label: "Details" },
                  { stepNum: 3, label: "Join Link" },
                  { stepNum: 4, label: "Review" },
                ].map(({ stepNum, label }) => (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => setStep(stepNum)}
                    className="flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        step === stepNum
                          ? "bg-primary text-primary-foreground scale-110 shadow-md ring-4 ring-primary/20"
                          : step > stepNum
                          ? "bg-emerald-600 text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step > stepNum ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                    </div>
                    <span className={`text-[11px] font-semibold hidden sm:inline ${step === stepNum ? "text-primary" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basics */}
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold">Community Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g. Bangalore Board Game Guild"
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="short_description" className="text-sm font-semibold">
                        Tagline / Short Summary * (shown on search cards)
                      </Label>
                      <Textarea
                        id="short_description"
                        value={formData.short_description}
                        onChange={(e) => handleChange("short_description", e.target.value)}
                        placeholder="One or two sentences describing who you are and what you do..."
                        className="mt-1.5 rounded-xl resize-none"
                        rows={2}
                        maxLength={160}
                        required
                      />
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {formData.short_description.length}/160
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm font-semibold">Category *</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(val) => handleChange("category_id", val)}
                        >
                          <SelectTrigger className="mt-1.5 h-12 rounded-xl">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">City Location *</Label>
                        <Select
                          value={formData.location_id}
                          onValueChange={(val) => handleChange("location_id", val)}
                        >
                          <SelectTrigger className="mt-1.5 h-12 rounded-xl">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.city}, {l.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Meeting Mode</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[
                          { id: "offline", label: "In Person" },
                          { id: "online", label: "Online Only" },
                          { id: "hybrid", label: "Hybrid" },
                        ].map((m) => (
                          <Button
                            key={m.id}
                            type="button"
                            variant={formData.meeting_mode === m.id ? "default" : "outline"}
                            onClick={() => handleChange("meeting_mode", m.id)}
                            className="rounded-xl text-xs"
                          >
                            {m.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Cover Photo Presets */}
                    <div>
                      <Label className="text-sm font-semibold">Cover Artwork Preset</Label>
                      <p className="text-xs text-muted-foreground mb-2">Pick a curated high-res photo theme:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PHOTO_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleChange("cover_image_url", preset.url)}
                            className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                              formData.cover_image_url === preset.url
                                ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                                : "border-transparent opacity-75 hover:opacity-100"
                            }`}
                          >
                            <img src={preset.url} alt="" className="h-16 w-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[10px] font-bold text-white text-center truncate">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="rounded-full px-6 gap-2"
                      >
                        Continue to Details <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Full Story & Vibe */}
                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <Label htmlFor="long_description" className="text-sm font-semibold">
                        Full Community Story *
                      </Label>
                      <Textarea
                        id="long_description"
                        value={formData.long_description}
                        onChange={(e) => handleChange("long_description", e.target.value)}
                        placeholder="Tell people the story of why this circle was created, what gatherings look like, and who is welcome..."
                        className="mt-1.5 rounded-xl resize-none font-sans"
                        rows={6}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="frequency" className="text-sm font-semibold">Meeting Cadence</Label>
                        <Input
                          id="frequency"
                          value={formData.meeting_frequency}
                          onChange={(e) => handleChange("meeting_frequency", e.target.value)}
                          placeholder="e.g. Every alternate Saturday 4 PM"
                          className="mt-1.5 h-12 rounded-xl"
                        />
                      </div>

                      <div>
                        <Label htmlFor="member_count" className="text-sm font-semibold">Current Member Count</Label>
                        <Input
                          id="member_count"
                          type="number"
                          value={formData.member_count}
                          onChange={(e) => handleChange("member_count", e.target.value)}
                          placeholder="e.g. 50"
                          className="mt-1.5 h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rules" className="text-sm font-semibold">
                        Good to Know & Community Rules *
                      </Label>
                      <Textarea
                        id="rules"
                        value={formData.rules}
                        onChange={(e) => handleChange("rules", e.target.value)}
                        placeholder="List guidelines (e.g. helmets required, zero tolerance for harassment, RSVP policies)..."
                        className="mt-1.5 rounded-xl resize-none font-sans"
                        rows={4}
                      />
                    </div>

                    {/* Tags selector */}
                    <div>
                      <Label className="text-sm font-semibold">Topic Tags</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {SUGGESTED_TAGS.map((tag) => {
                          const active = formData.selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              }`}
                            >
                              {active ? `✓ ${tag}` : `+ ${tag}`}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Input
                          value={customTag}
                          onChange={(e) => setCustomTag(e.target.value)}
                          placeholder="Add custom tag..."
                          className="h-9 rounded-xl text-xs max-w-xs"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomTag())}
                        />
                        <Button
                          type="button"
                          onClick={handleAddCustomTag}
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="rounded-full px-6 gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        className="rounded-full px-6 gap-2"
                      >
                        Continue to Join Links <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Join Links */}
                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <Label className="text-sm font-semibold">Primary Platform to Join</Label>
                      <Select
                        value={formData.primary_join_method}
                        onValueChange={(val: "whatsapp" | "telegram" | "discord" | "website" | "email") => handleChange("primary_join_method", val)}
                      >
                        <SelectTrigger className="mt-1.5 h-12 rounded-xl">
                          <SelectValue placeholder="Select primary method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp Group / Community</SelectItem>
                          <SelectItem value="telegram">Telegram Channel / Group</SelectItem>
                          <SelectItem value="discord">Discord Server</SelectItem>
                          <SelectItem value="website">Official Website / Membership Portal</SelectItem>
                          <SelectItem value="email">Direct Email Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp Invite Link</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp_link}
                        onChange={(e) => handleChange("whatsapp_link", e.target.value)}
                        placeholder="https://chat.whatsapp.com/..."
                        className="mt-1.5 h-12 rounded-xl"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="telegram" className="text-sm font-semibold">Telegram Link</Label>
                        <Input
                          id="telegram"
                          value={formData.telegram_link}
                          onChange={(e) => handleChange("telegram_link", e.target.value)}
                          placeholder="https://t.me/..."
                          className="mt-1.5 h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discord" className="text-sm font-semibold">Discord Server Link</Label>
                        <Input
                          id="discord"
                          value={formData.discord_link}
                          onChange={(e) => handleChange("discord_link", e.target.value)}
                          placeholder="https://discord.gg/..."
                          className="mt-1.5 h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact_email" className="text-sm font-semibold">
                        Host Verification Email * (Confidential, for moderation)
                      </Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => handleChange("contact_email", e.target.value)}
                        placeholder="you@yourdomain.org"
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="rounded-full px-6 gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(4)}
                        className="rounded-full px-6 gap-2"
                      >
                        Review & Publish <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Final Review */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="rounded-2xl border border-foreground/10 bg-secondary/30 p-5 space-y-3">
                      <h3 className="font-display text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        Ready for Submission
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Nearloom prioritizes trust and safety. New listings are automatically placed in the review queue
                        and will appear in the directory as soon as approved.
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-foreground/10 py-2">
                        <span className="text-muted-foreground">Community:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-foreground/10 py-2">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{selectedCategoryObj?.name || "General"}</span>
                      </div>
                      <div className="flex justify-between border-b border-foreground/10 py-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{selectedLocationObj?.city || "Online"}</span>
                      </div>
                      <div className="flex justify-between border-b border-foreground/10 py-2">
                        <span className="text-muted-foreground">Join Channel:</span>
                        <span className="capitalize font-semibold">{formData.primary_join_method}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(3)}
                        className="rounded-full px-6 gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="rounded-full px-8 gap-2 bg-primary font-bold shadow-lg shadow-primary/25"
                      >
                        Submit Community Listing <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Card>

            {/* Right Side: Live Interactive Card Preview */}
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Live Card Preview
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ● Updates in Real Time
                </span>
              </div>

              <div className="max-w-sm mx-auto">
                <CommunityCard
                  id="preview-card"
                  name={formData.name || "Your Circle Name"}
                  slug="preview"
                  short_description={formData.short_description || "Your community summary will appear here..."}
                  cover_image_url={formData.cover_image_url}
                  category={selectedCategoryObj ? { name: selectedCategoryObj.name, slug: selectedCategoryObj.slug } : undefined}
                  location={selectedLocationObj ? { city: selectedLocationObj.city, state: selectedLocationObj.state } : undefined}
                  member_count={parseInt(formData.member_count) || 10}
                  meeting_mode={formData.meeting_mode}
                  is_verified={false}
                  tags={formData.selectedTags.map((t) => ({ name: t }))}
                />
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card p-4 text-xs text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">💡 Host Tip:</p>
                Communities with high-res photography and explicit, friendly rules get 3.2x more join clicks.
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default CreateCommunity;
