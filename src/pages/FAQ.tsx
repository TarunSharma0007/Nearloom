import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is Nearloom?",
      answer: "Nearloom helps you discover and join communities based on your interests and location. It is a discovery layer for groups that already gather in person or on platforms such as WhatsApp, Telegram, and Discord.",
    },
    {
      question: "How do I find communities near me?",
      answer: "Simply use our search feature on the homepage or browse page. You can filter by location (city, district, or state), category, and specific interests. Our location-based search helps you find communities in your exact area.",
    },
    {
      question: "Is Nearloom free to use?",
      answer: "Yes. Nearloom is free for community seekers, and organizers can submit a standard community listing at no cost.",
    },
    {
      question: "How do I join a community?",
      answer: "Once you find a community you're interested in, click on it to view the full details. You'll find join buttons for various platforms like WhatsApp, Telegram, Discord, or website links. Simply click your preferred method to connect with the community.",
    },
    {
      question: "Can I list my own community?",
      answer: "Absolutely! Click on 'List Your Community' in the navigation menu. Fill out the community details including name, description, location, category, and how people can join. Your listing will be reviewed and published shortly.",
    },
    {
      question: "How are communities verified?",
      answer: "Our team reviews all community listings to ensure they meet our quality standards. Verified communities receive a verification badge. We check for accurate information, appropriate content, and genuine community purposes.",
    },
    {
      question: "What types of communities can I find on Nearloom?",
      answer: "You can find a wide variety of communities including technology groups, sports clubs, arts and culture organizations, educational groups, professional networks, social clubs, volunteering organizations, and much more across 25+ categories.",
    },
    {
      question: "Can I save communities for later?",
      answer: "Yes! When you're logged in, you can save communities to your favorites list. This makes it easy to come back to communities you're interested in joining later.",
    },
    {
      question: "How do I edit my community listing?",
      answer: "Log in to your account and go to your dashboard. You'll see all your community listings where you can edit details, update information, and manage your communities.",
    },
    {
      question: "What if I have issues with a community?",
      answer: "If you encounter any issues with a community or listing, please use the report feature on the community page or contact our support team. We take all reports seriously and will investigate promptly.",
    },
    {
      question: "How often is the platform updated?",
      answer: "We continuously improve Nearloom. Community information changes as organizers update their listings, and we add categories based on real discovery needs.",
    },
    {
      question: "Can I search for online communities?",
      answer: "Yes! You can filter for online-only communities or communities that offer both online and offline meetings. Use the meeting mode filter in the search to find communities that match your preference.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
            Frequently Asked <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Find answers to common questions about Nearloom and how it works
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-10 backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
                  <AccordionTrigger className="text-left font-display font-semibold hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-8 md:p-12 text-center space-y-6 backdrop-blur-sm bg-card/50 border-border/50 hover-lift">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <MessageCircle className="h-8 w-8" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
          </div>
          <Button size="lg" onClick={() => navigate("/contact")} className="font-medium">
            Contact Support
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default FAQ;
