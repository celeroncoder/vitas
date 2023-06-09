"use client";

import { UserProfile as ClerkUserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export const UserProfile = () => {
  const theme = useTheme();
  return (
    <ClerkUserProfile
      appearance={{ baseTheme: theme.theme === "dark" ? dark : undefined }}
    />
  );
};
