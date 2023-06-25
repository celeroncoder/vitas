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
	SelectItem,
} from "@/components/ui/select";
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
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
							<SunIcon className="w-3 mr-3 inline" />
							Light
						</SelectItem>
						<SelectItem value="dark">
							<MoonIcon className="w-3 mr-3 inline" />
							Dark
						</SelectItem>
						<SelectSeparator />
						<SelectItem value="system">
							<LaptopIcon className="w-3 mr-3 inline" />
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
