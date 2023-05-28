"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, LucideIcon, User } from "lucide-react";

export type SidebarLink = {
  label: string;
  url: string;
  icon: LucideIcon;
};

const generateLinks = (id: string): SidebarLink[] => [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Members",
    url: `/dashboard/projects/${id}`,
    icon: User,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const links = generateLinks(params!.id as string);

  return (
    <div className="w-16 md:w-48 lg:w-48 border-r-2 border-black flex flex-col gap-2 p-2 duration-300">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.url}
          className={cn(
            buttonVariants({
              variant: pathname == link.url ? "secondary" : "ghost",
            }),
            "flex items-center justify-start gap-2"
          )}
        >
          <link.icon className="w-4" />
          <span className="font-semibold hidden md:block lg:block">
            {link.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
