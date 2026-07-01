import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        gold: "#F5C518",
        paper: "#FFFFFF",
        mist: "#F7F7F2"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(17,17,17,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
