"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

export type SidebarLink = {
  label: string;
  url: string;
  icon: React.ReactNode;
  className?: string;
};

export const Sidebar: React.FC<{
  links: SidebarLink[];
}> = ({ links }) => {
  const pathname = usePathname();

  return (
    <div className="select-none w-16 md:w-48 lg:w-48 flex flex-col gap-2 p-2 duration-300">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.url}
          className={cn(
            buttonVariants({
              variant: pathname == link.url ? "secondary" : "ghost",
            }),
            "flex items-center justify-start gap-2",
            link.className
          )}
        >
          {link.icon}
          <span className="font-semibold hidden md:block lg:block">
            {link.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
