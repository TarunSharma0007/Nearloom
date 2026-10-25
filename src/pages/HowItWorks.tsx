import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Users, Rocket, MessageCircle, Shield } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Search & Discover",
      description: "Use our powerful search to find communities by location, category, or interests. Filter by city, district, or state.",
    },
    {
      number: "02",
      icon: Filter,
      title: "Filter by Interest",
      description: "Browse through diverse categories from tech and sports to arts and education. Find exactly what you're looking for.",
    },
    {
      number: "03",
      icon: Users,
      title: "View Details",
      description: "Check out community profiles, see member counts, meeting schedules, and read descriptions to find the perfect match.",
    },
    {
      number: "04",
      icon: Rocket,
      title: "Join Instantly",
      description: "Click to join via WhatsApp, Telegram, Discord, or other platforms. Connect with community members right away.",
    },
  ];

  const forCommunities = [
    {
      icon: MessageCircle,
      title: "List Your Community",
      description: "Create a detailed profile for your community with all relevant information and contact methods.",
    },
    {
      icon: Users,
      title: "Get Discovered",
      description: "Reach people in your area who are actively looking for communities like yours.",
    },
    {
      icon: Shield,
      title: "Build Trust",
      description: "Verified listings and moderation ensure quality members and genuine interest.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
            How <span className="text-primary italic">Nearloom works</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Finding and joining communities has never been easier. Here's how to get started.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="p-8 md:p-10 hover-lift backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-display font-bold text-primary/30">{step.number}</span>
                    <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* For Communities Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">For Community Leaders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make your community discoverable and grow your member base
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {forCommunities.map((item, index) => (
              <Card
                key={item.title}
                className="p-8 space-y-4 hover-lift backdrop-blur-sm bg-card/50 border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-xl font-display">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center space-y-6 backdrop-blur-sm bg-card/50 border-border/50 hover-lift">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking to join a community or list your own, Nearloom makes it simple.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/browse")} className="font-medium">
              Find Communities
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/create-community")} className="font-medium">
              List Your Community
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default HowItWorks;
