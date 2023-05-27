import { UserButton } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Link from "next/link";
import { Title } from "./ui/title";

export const Header = () => {
  return (
    <header className="relative h-16 w-full border-b-2 border-black flex items-center justify-between px-4 py-2 select-none">
      <Link
        href="/dashboard"
        className="px-4 py-1 bg-lime-200 rounded-full border-[2.5px] border-b-[5px] border-r-[5px] border-black"
      >
        <Title className="text-xl tracking-tighter leading-tight font-bold">
          get.id
        </Title>
      </Link>
      <UserButton
        appearance={{
          baseTheme: neobrutalism,
          variables: { colorPrimary: "#a3e635" },
        }}
        afterSignOutUrl="/sign-in"
      />
    </header>
  );
};
