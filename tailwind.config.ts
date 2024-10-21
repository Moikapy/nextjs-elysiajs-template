import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
 fontFamily: {
        mono: ["Courier New", "Courier", "monospace"],
      },

  },
  plugins: [ require("daisyui")],
  daisyui: {
    themes: [
      {
        monochrome: {
          primary: "#ffffff",
          secondary: "#000000",
          accent: "#333333",
          neutral: "#ffffff",
          "base-100": "#000000",
          info: "#ffffff",
          success: "#333333",
          warning: "#666666",
          error: "#999999",
        },
      },
    ],
  },
};
export default config;
