import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24-48 hours.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@nearloom.app",
      description: "For general inquiries and support",
    },
    {
      icon: MessageSquare,
      title: "Community Support",
      content: "organizers@nearloom.app",
      description: "For community-related questions",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Available Nationwide",
      description: "Operating across major cities",
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "24-48 hours",
      description: "We aim to respond quickly",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
            Get in <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {contactInfo.map((info, index) => (
            <Card
              key={info.title}
              className="p-6 space-y-3 hover-lift backdrop-blur-sm bg-card/50 border-border/50 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <info.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold font-display mb-1">{info.title}</h3>
                <p className="text-sm font-medium text-foreground">{info.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-10 backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-display font-bold">Send us a Message</h2>
              <p className="text-muted-foreground">Fill out the form below and we'll get back to you soon</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  placeholder="How can we help you?" 
                  required 
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  required
                  rows={6}
                  className="bg-background/50 resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full font-medium" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default Contact;
