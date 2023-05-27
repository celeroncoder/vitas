import { inter } from "@/lib/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

export const metadata = {
  title: "getid",
  description: "Generate ID Cards for your Team",
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
          variables: { colorPrimary: "#8b5cf6" },
        }}
      >
        <body className={inter.className}>{children}</body>
      </ClerkProvider>
    </html>
  );
}
