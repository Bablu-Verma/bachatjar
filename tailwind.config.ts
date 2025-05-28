import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          light: "#ffffff",
          primary: "#CC2B52",
          secondary: "#0f1336",
          dark: "#212121",
          grayLight: "#f2f2f2",
          highlight_color : "#f4f4f4",
      },
      boxShadow:{
        box_shadow_color: "0 1px 4px 0 rgba(17,19,35,.08)",
        box_shadow_hover: "0 2px 14px 3px rgba(0,0,0,.03)"
      },
      fontFamily: {
        roboto: ['"Roboto"', "sans-serif"],
      },
      screens: {
        mobile: "320px", 
      },
    },
  },
  plugins: [],
} satisfies Config;
