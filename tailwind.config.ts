import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        "fluid-xs": "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 0.8rem + 0.3vw, 1rem)",
        "fluid-base": "clamp(1rem, 0.9rem + 0.4vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)",
        "fluid-xl": "clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)",
        "fluid-2xl": "clamp(1.5rem, 1.2rem + 1.2vw, 2rem)",
        "fluid-3xl": "clamp(1.875rem, 1.4rem + 1.8vw, 2.5rem)",
        "fluid-4xl": "clamp(2.25rem, 1.6rem + 2.5vw, 3.5rem)",
        "fluid-5xl": "clamp(3rem, 2rem + 3.5vw, 4.5rem)",
        "fluid-hero": "clamp(3.5rem, 2rem + 6vw, 8rem)",
      },
      letterSpacing: {
        "display": "-0.045em",
        "display-tight": "-0.06em",
        "heading": "-0.035em",
        "eyebrow": "0.18em",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glass": "0 8px 32px hsl(var(--glass-shadow))",
        "glass-lg": "0 16px 48px hsl(var(--glass-shadow))",
        "premium": "0 1px 3px hsl(var(--foreground) / 0.04), 0 6px 24px hsl(var(--foreground) / 0.06)",
        "premium-hover": "0 2px 6px hsl(var(--foreground) / 0.04), 0 16px 48px hsl(var(--foreground) / 0.1)",
        "premium-lg": "0 4px 12px hsl(var(--foreground) / 0.05), 0 24px 64px hsl(var(--foreground) / 0.08)",
        "glow-primary": "0 0 20px hsl(var(--primary) / 0.15), 0 0 60px hsl(var(--primary) / 0.08)",
        "inner-glow": "inset 0 1px 0 hsl(var(--foreground) / 0.03)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.95" }
        },
        "logo-breathe": {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.05)", filter: "brightness(1.1)" }
        },
        "dot-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.2)", opacity: "0.8" }
        },
        "path-draw": {
          "0%": { strokeDashoffset: "200", opacity: "0.5" },
          "50%": { strokeDashoffset: "0", opacity: "1" },
          "100%": { strokeDashoffset: "200", opacity: "0.5" }
        },
        "path-draw-reverse": {
          "0%": { strokeDashoffset: "-200", opacity: "0.5" },
          "50%": { strokeDashoffset: "0", opacity: "1" },
          "100%": { strokeDashoffset: "-200", opacity: "0.5" }
        },
        "soft-reveal": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "80%, 100%": { transform: "scale(2)", opacity: "0" }
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "logo-breathe": "logo-breathe 5s ease-in-out infinite",
        "dot-pulse": "dot-pulse 2.5s ease-in-out infinite",
        "path-draw": "path-draw 6s ease-in-out infinite",
        "path-draw-reverse": "path-draw-reverse 6s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "soft-reveal": "soft-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "count-up": "count-up 0.5s ease-out both",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
