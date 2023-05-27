import { inter } from "@/lib/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

export const metadata = {
  title: "getid",
  description: "Generate ID Cards for your Team",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          baseTheme: neobrutalism,
          variables: { colorPrimary: "#a3e635" },
        }}
      >
        <body style={inter.style}>{children}</body>
      </ClerkProvider>
    </html>
  );
}
