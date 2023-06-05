import { UserButton } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Link from "next/link";
import { Title } from "./ui/title";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

export const Header = () => {
  return (
    <header className="relative h-16 w-full border-b-2 border-foreground flex items-center justify-between px-4 py-2 select-none">
      <Link href="/dashboard" passHref>
        <Logo className="text-2xl" />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton
          appearance={{
            baseTheme: neobrutalism,
            variables: { colorPrimary: "#a3e635" },
          }}
          afterSignOutUrl="/sign-in"
        />
      </div>
    </header>
  );
};
