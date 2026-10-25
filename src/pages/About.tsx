import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Target, Heart, Zap, Shield, Globe } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in the power of bringing people together around shared interests and passions.",
    },
    {
      icon: Target,
      title: "Discovery Made Easy",
      description: "Finding the right community shouldn't be complicated. We make it simple and intuitive.",
    },
    {
      icon: Heart,
      title: "Authentic Connections",
      description: "Real communities with real people, fostering genuine relationships and engagement.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Platform-moderated communities ensure quality, safety, and trustworthiness for all members.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Active Communities" },
    { number: "50K+", label: "Community Members" },
    { number: "100+", label: "Cities Covered" },
    { number: "25+", label: "Categories" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
            About <span className="text-primary italic">Nearloom</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            We're building the easiest way to discover and join communities near you. 
            No social media noise, just structured discovery.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-6 text-center hover-lift backdrop-blur-sm bg-card/50 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
            <Zap className="h-4 w-4" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Making Community Discovery Simple
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In a world of endless social media noise, finding the right community should be straightforward. 
            Nearloom is a neutral, structured platform designed purely for discovery, not another social network. 
            We help you find communities based on your interests and location, making it easy to connect with 
            like-minded people in your area.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do at Nearloom
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <Card 
              key={value.title} 
              className="p-8 space-y-4 hover-lift backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <value.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-xl font-display">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center space-y-6 backdrop-blur-sm bg-card/50 border-border/50 hover-lift">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Ready to Find Your Community?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people discovering and connecting with communities near them.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/browse")} className="font-medium">
              Explore Communities
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

export default About;
