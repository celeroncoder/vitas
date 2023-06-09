"use client";

import {
  ChevronDown,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  UserIcon,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
        <ChevronDown className="w-4" />
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
          <p>
            {user.username === "" || !user.username
              ? user.firstName
              : user.username}
          </p>
          <ChevronDown className="w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          passHref
          href="https://github.com/celeroncoder/get.id"
          target="_blank"
        >
          <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API (coming soon...)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
