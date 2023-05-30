import { Toaster } from "@/components/ui/toaster";
import { inter } from "@/lib/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

export const metadata = {
  title: "get.id",
  description: "Generate ID Cards for your Team",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider
        appearance={{
          baseTheme: neobrutalism,
          variables: { colorPrimary: "#a3e635" },
        }}
      >
        <body
          style={inter.style}
          className="scrollbar-thin scrollbar-thumb-rounded-sm scrollbar-thumb-lime-200/75 scrollbar-track-background scroll-smooth"
        >
          {children}
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
