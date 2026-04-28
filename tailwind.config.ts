import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
    },
    borderRadius: {
      none: "0px",
      sm: "6px",
      md: "10px",
      lg: "16px",
      xl: "20px",
      "2xl": "28px",
      "3xl": "36px",
      frame: "48px",
      full: "9999px",
    },
    fontFamily: {
      sans: ["Geist Variable", "ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["Geist Mono Variable", "ui-monospace", "SFMono-Regular", "monospace"],
    },
    fontSize: {
      display: ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
      h1: ["28px", { lineHeight: "34px", letterSpacing: "-0.01em", fontWeight: "600" }],
      h2: ["20px", { lineHeight: "26px", letterSpacing: "0", fontWeight: "600" }],
      body: ["16px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "400" }],
      caption: ["13px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "500" }],
      mono: ["16px", { lineHeight: "20px", fontWeight: "500" }],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: {
        canvas: "#030305",
        app: "#08080D",
        surface: "#111119",
        "surface-2": "#1A1A25",
        "surface-3": "#232333",
        glass: "rgba(17,17,25,0.74)",
        scrim: "rgba(3,3,5,0.72)",
      },
      border: {
        subtle: "rgba(255,255,255,0.08)",
        strong: "rgba(255,255,255,0.16)",
        solar: "rgba(245,208,111,0.45)",
        neural: "rgba(142,167,255,0.38)",
        shell: "rgba(255,255,255,0.12)",
      },
      text: {
        primary: "#F2F0EA",
        secondary: "#B6B2A8",
        tertiary: "#77747D",
        inverse: "#08080D",
      },
      brand: {
        solar: "#F5D06F",
        "solar-muted": "rgba(245,208,111,0.14)",
        "solar-glow": "rgba(245,208,111,0.24)",
        neural: "#8EA7FF",
        "neural-muted": "rgba(142,167,255,0.14)",
        "neural-glow": "rgba(142,167,255,0.22)",
      },
      semantic: {
        success: "#7CFFB2",
        "success-muted": "rgba(124,255,178,0.13)",
        error: "#FF6B7A",
        "error-muted": "rgba(255,107,122,0.13)",
        warning: "#FFD166",
        "warning-muted": "rgba(255,209,102,0.13)",
      },
      shell: {
        outer: "#050507",
      },
    },
    extend: {
      boxShadow: {
        frame:
          "0 32px 120px rgba(0,0,0,0.70), 0 0 80px rgba(245,208,111,0.08)",
        "active-card":
          "0 0 0 1px rgba(245,208,111,0.28), 0 0 36px rgba(245,208,111,0.14)",
        "neural-card":
          "0 0 0 1px rgba(142,167,255,0.24), 0 0 32px rgba(142,167,255,0.12)",
        "cta-solar": "0 0 32px rgba(245,208,111,0.24)",
      },
      backgroundImage: {
        "app-glow":
          "radial-gradient(circle at 50% -10%, rgba(245,208,111,0.18), transparent 38%), radial-gradient(circle at 90% 20%, rgba(142,167,255,0.12), transparent 34%)",
        "corona-glow":
          "radial-gradient(circle at 50% 0%, rgba(245,208,111,0.28), transparent 42%), radial-gradient(circle at 20% 25%, rgba(142,167,255,0.16), transparent 34%)",
      },
    },
  },
  plugins: [],
};

export default config;
