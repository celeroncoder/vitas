"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectSeparator,
} from "@/components/ui/select";
import { Laptop2, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export const ThemeToggleCard: React.FC<{}> = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    (theme as any) || "system"
  );

  useEffect(() => {
    switch (selectedTheme) {
      case "light":
        setTheme("light");
        break;
      case "dark":
        setTheme("dark");
        break;
      case "system":
        if (!systemTheme) setSelectedTheme("light");
        setTheme(systemTheme || "light");
        break;
    }
  }, [selectedTheme]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          The Color Theme/Scheme of your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={(val) => setSelectedTheme(val as Theme)}
          value={selectedTheme}
        >
          <SelectTrigger className="capitalize w-[180px]">
            <SelectValue placeholder={theme} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <SunMedium className="w-3 mr-3" />
              <p className="">Light</p>
            </SelectItem>
            <SelectItem value="dark">
              <MoonStar className="w-3 mr-3 inline" />
              Dark
            </SelectItem>
            <SelectSeparator />
            <SelectItem value="system">
              <Laptop2 className="w-3 mr-3 inline" />
              System
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="justify-end">
        <p className="text-muted-foreground text-sm">
          This changes your applications theme ✨. It's your systems preferred
          theme by defualt.
        </p>
      </CardFooter>
    </Card>
  );
};

import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>
      <div className="flex items-center justify-center">{children}</div>
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;
