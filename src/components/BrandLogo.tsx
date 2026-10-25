import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  link?: boolean;
}

const Mark = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="15" fill="currentColor" />
    <path
      d="M13 29.5C17.4 24.8 20.6 22.8 24.2 22.8C28 22.8 30.7 25.3 35 30"
      stroke="hsl(var(--brand-paper))"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M14 18.5C18.1 22.1 20.8 23.5 24 23.5C27.4 23.5 30.1 21.9 34 18.2"
      stroke="hsl(var(--brand-sun))"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <circle cx="13" cy="29.5" r="2.6" fill="hsl(var(--brand-leaf))" />
    <circle cx="35" cy="30" r="2.6" fill="hsl(var(--brand-leaf))" />
    <circle cx="14" cy="18.5" r="2.6" fill="hsl(var(--brand-paper))" />
    <circle cx="34" cy="18.2" r="2.6" fill="hsl(var(--brand-paper))" />
  </svg>
);

export const BrandLogo = ({ className, compact = false, link = true }: BrandLogoProps) => {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark className="h-10 w-10 shrink-0 text-primary" />
      {!compact && (
        <span className="font-display text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
          Nearloom
        </span>
      )}
    </span>
  );

  return link ? (
    <Link to="/" aria-label="Nearloom home" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
      {content}
    </Link>
  ) : content;
};

export default BrandLogo;
