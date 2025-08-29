import type { Config } from "tailwindcss"

const config = {
  
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for Stripe-like design
        "stripe-gradient-start": "#8a2be2", // Blue Violet
        "stripe-gradient-middle": "#ff69b4", // Hot Pink
        "stripe-gradient-end": "#00bfff", // Deep Sky Blue
        "stripe-dark-blue": "#2a2e43", // Dark blue for text/elements
        "stripe-light-gray": "#f8f9fa", // Light gray for backgrounds
        "stripe-text-dark": "#333333", // Dark text
        "stripe-text-light": "#666666", // Lighter text

        // New custom colors for the sidebar
        "sidebar-dark-blue-start": "#1A202C", // A deep, muted blue
        "sidebar-dark-blue-end": "#0F172A", // A slightly darker blue for gradient end
        "sidebar-text-light": "#E0E7FF", // Very light blue for text
        "sidebar-card-bg": "rgba(30, 41, 59, 0.7)", // Semi-transparent dark blue for cards
        "sidebar-border-subtle": "rgba(51, 65, 85, 0.5)", // Subtle border for elements
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "stripe-xl": "1.5rem", // Custom large border radius for cards
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
