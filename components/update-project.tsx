"use client";

import { Project } from "@prisma/client";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { ProjectUpdateProps } from "@/lib/validators";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { ShadowNoneIcon } from "@radix-ui/react-icons";
import { CardContent, CardFooter } from "./ui/card";

export const UpdateProject: React.FC<{ project: Project }> = ({ project }) => {
	const [name, setName] = useState(project.name);
	const [displayName, setDisplayName] = useState(project.displayName);
	const [displayUrl, setDisplayUrl] = useState(project.displayUrl);

	const [isChange, setIsChange] = useState(false);

	useEffect(() => {
		if (
			name !== project.name ||
			displayName !== project.displayName ||
			displayUrl !== project.displayUrl
		)
			setIsChange(true);
		else setIsChange(false);
	}, [name, displayName, displayUrl]);

	const reset = () => {
		setName(project.name);
		setDisplayName(project.displayName);
		setDisplayUrl(project.displayUrl);
	};

	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const save = async () => {
		setIsLoading(true);
		const payload: z.infer<typeof ProjectUpdateProps> = {
			displayName,
			name,
			displayUrl: displayUrl ? displayUrl : undefined,
		};

		const res = await api.put(`/projects/${project.id}/update`, payload);

		if (res.status == 200)
			toast({
				title: "Project Updated Successfully!",
				description: `Project, "${name}" updated successfully!`,
			});
		else
			toast({
				title: "Some Error Occurred!",
				description: "Uh Oh! Some problem Occurred while creating the project",
				variant: "destructive",
			});

		setIsLoading(false);
		setIsChange(false);
		router.push(`/dashboard/projects/${project.id}`);
	};

	return (
		<>
			<CardContent className="flex flex-col gap-4">
				{/* name */}
				<div className="flex flex-col gap-1">
					<Label className="">Name</Label>
					<Input value={name} onChange={(e) => setName(e.target.value)} />
					<p className="text-sm text-muted-foreground">
						This is the main name of the project, that is shown on the
						dashboard.
					</p>
				</div>

				{/* display name */}
				<div className="flex flex-col gap-1">
					<Label className="">Display Name</Label>
					<Input
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
					<p className="text-sm text-muted-foreground">
						This is the name of the project, that is displayed on the ID Card
						Itself.
					</p>
				</div>

				{/* display url */}
				<div className="flex flex-col gap-1">
					<Label className="">Display URL</Label>
					<Input
						value={displayUrl || ""}
						onChange={(e) =>
							setDisplayUrl(e.target.value === "" ? null : e.target.value)
						}
					/>
					<p className="text-sm text-muted-foreground">
						This will be displayed on the ID Card, add your social media handel,
						website url or any tagline you want to display.
					</p>
				</div>
			</CardContent>

			<CardFooter className="justify-end gap-2">
				<Button onClick={reset} disabled={!isChange} variant={"secondary"}>
					Reset
				</Button>
				<Button onClick={save} disabled={isLoading || !isChange}>
					{isLoading && <ShadowNoneIcon className="mr-2 w-3 animate-spin" />}
					{isLoading ? "Please Wait" : "Save"}
				</Button>
			</CardFooter>
		</>
	);
};
