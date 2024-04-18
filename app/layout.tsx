import { Toaster } from "@/components/ui/toaster";
import { general_sans, satoshi, space_grotesk, space_mono } from "@/lib/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { QueryProvider } from "@/components/query-provider";

export const metadata: Metadata = {
  title: "VITAS",
  description: "Virtual Inter-Academia Ticket Allocation System",
  icons: "/favicon.png",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "scrollbar-thin scrollbar-thumb-rounded-sm scrollbar-thumb-lime-200/75 scrollbar-track-background scroll-smooth",
          general_sans.variable,
          satoshi.variable,
          space_mono.variable,
          space_grotesk.variable
        )}
      >
        <ClerkProvider
          appearance={{
            // baseTheme: neobrutalism,
            variables: { colorPrimary: "#a3e635" },
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="theme"
          >
            <QueryProvider>{children}</QueryProvider>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
