import { Inter, Space_Grotesk } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  preload: false,
  fallback: ["sans-serif"],
});
