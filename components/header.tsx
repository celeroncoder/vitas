import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { UserDropdownMenu } from "@/components/user-button";

export const Header = () => {
  return (
    <header className="relative h-16 w-full border-b-2 border-foreground flex items-center justify-between px-4 py-2 select-none">
      <Link href="/dashboard" passHref>
        <Logo className="text-2xl" />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserDropdownMenu />
      </div>
    </header>
  );
};
