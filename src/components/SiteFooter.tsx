import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { brand } from "@/lib/brand";

const footerLinks = [
  { label: "Explore communities", to: "/browse" },
  { label: "List a community", to: "/create-community" },
  { label: "How it works", to: "/how-it-works" },
  { label: "About Nearloom", to: "/about" },
  { label: "Help & FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export const SiteFooter = () => (
  <footer className="mt-24 border-t border-foreground/10 bg-foreground text-background">
    <div className="container grid gap-12 px-4 py-14 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-20">
      <div className="max-w-xl space-y-6">
        <BrandLogo link={false} className="[&_span]:text-background" />
        <p className="max-w-lg font-display text-3xl leading-tight tracking-[-0.035em] text-background/95 md:text-4xl">
          The shortest distance between you and your people.
        </p>
        <a
          href={`mailto:${brand.email}`}
          className="inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
        >
          <Mail className="h-4 w-4" />
          {brand.email}
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 self-end text-sm">
        {footerLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center justify-between border-b border-background/15 py-3 text-background/70 transition-colors hover:text-background"
          >
            {item.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
    <div className="container flex flex-col gap-3 border-t border-background/10 px-4 py-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between md:px-8">
      <p>© {new Date().getFullYear()} Nearloom. Built for real-world belonging.</p>
      <div className="flex gap-5">
        <Link to="/privacy" className="hover:text-background">Privacy</Link>
        <Link to="/terms" className="hover:text-background">Terms</Link>
      </div>
    </div>
  </footer>
);
