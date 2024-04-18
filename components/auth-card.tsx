"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { UseThemeProps } from "next-themes/dist/types";

const getApperance = (theme: UseThemeProps) => ({
  baseTheme: theme.theme === "dark" ? dark : undefined,
});

export const AuthCard: React.FC<
  { type: "sign-in" } | { type: "sign-up"; afterSignUpUrl: string }
> = ({ type }) => {
  const theme = useTheme();
  const appearance = getApperance(theme);

  if (type === "sign-in")
    return <SignIn path="/sign-in" appearance={appearance} />;
  else return <SignUp path="/sign-up" appearance={appearance} />;
};
