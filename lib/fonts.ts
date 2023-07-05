import { Space_Grotesk, Space_Mono } from "next/font/google";
import localFont from "next/font/local";

export const general_sans = localFont({
	src: "../public/fonts/GeneralSans-Variable.ttf",
	fallback: ["sans-serif"],
	variable: "--font-heading",
	weight: "variable",
});

export const satoshi = localFont({
	src: "../public/fonts/Satoshi-Variable.ttf",
	fallback: ["sans-serif"],
	variable: "--font-sans",
	weight: "variable",
});

export const space_mono = Space_Mono({
	subsets: ["latin"],
	weight: "700",
	variable: "--font-mono",
	fallback: ["monospace"],
	preload: true,
});

export const space_grotesk = Space_Grotesk({
	subsets: ["latin"],
	fallback: ["sans-serif"],
	variable: "--font-primary",
});
