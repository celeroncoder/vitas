"use client";

import {
  ChevronDownIcon,
  CodeIcon,
  IdCardIcon,
  GitHubLogoIcon,
  AccessibilityIcon,
  ExitIcon,
  GearIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

import { useClerk } from "@clerk/nextjs";

export const UserDropdownMenu = () => {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();

  if (!user)
    return (
      <Button size="sm" variant="outline" className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="w-24 h-3 rounded" />
        <ChevronDownIcon className="w-4" />
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          <p className="lowercase font-heading">
            {user.username === "" || !user.username
              ? user.firstName
              : user.username}
          </p>
          <ChevronDownIcon className="w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
            <PersonIcon className="mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => router.push("/settings/billing")}>
            <IdCardIcon className="mr-2" />
            <span>Billing</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <GearIcon className="mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          passHref
          href="https://github.com/celeroncoder/vitas"
          target="_blank"
        >
          <DropdownMenuItem>
            <GitHubLogoIcon className="mr-2" />
            <span>GitHub</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <AccessibilityIcon className="mr-2" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <CodeIcon className="mr-2" />
          <span>API (coming soon...)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <ExitIcon className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
