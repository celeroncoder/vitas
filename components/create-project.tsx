"use client";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShadowNoneIcon, PlusIcon } from "@radix-ui/react-icons";

import { auth, currentUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { ProjectCreateProps } from "@/lib/validators";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";

export const CreateProject = () => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { userId } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const [name, setName] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [displayUrl, setDisplayUrl] = useState("");

	const reset = () => {
		setName("");
		setDisplayName("");
		setDisplayUrl("");
	};

	const create = async () => {
		setIsLoading(true);
		const payload = ProjectCreateProps.safeParse({
			name,
			displayName,
			displayUrl,
			userId: userId!,
		});

		if (payload.success) {
			const res = await api.post("/projects/create", payload.data);
			if (res.status == 201) {
				reset();
				toast({
					title: `Project ${res.data.name} Created!`,
					description: `Project ${res.data.name} with Display Name ${res.data.displayName} was created successfully!`,
				});
			} else
				toast({
					title: "Some Error Occurred!",
					description:
						"Uh Oh! Some problem Occurred while creating the project",
				});
		} else {
			toast({
				title: "Please Provide Correct Data",
				description:
					"Invalid Details for the project Provided, please change them",
			});
		}

		setIsLoading(false);
		setOpen(false);
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className={cn(
					"group shadow-sm hover:shadow-lg duration-300",
					buttonVariants({
						variant: "default",
						size: window.screen.width <= 640 ? "sm" : "default",
					})
				)}
			>
				<PlusIcon className="w-4 mr-2" /> Create Project
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>Create a new project</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1">
						<Label className="">Name</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							className=""
						/>
					</div>

					<div className="flex flex-col gap-1">
						<Label className="">Display Name</Label>
						<Input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className=""
						/>
					</div>

					<div className="flex flex-col gap-1">
						<Label className="">Display URL</Label>
						<Input
							value={displayUrl}
							onChange={(e) => setDisplayUrl(e.target.value)}
							className=""
						/>
					</div>

					<DialogFooter className="gap-1">
						<Button variant={"secondary"} onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={create} disabled={isLoading}>
							{isLoading && (
								<ShadowNoneIcon className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isLoading ? "Please Wait" : "Create"}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
};

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	name: z.string().min(3),
	displayName: z.string().min(3),
	displayUrl: z.string().min(3).optional(),
});

export const CreateProjectForm = () => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { userId } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			displayName: "",
			displayUrl: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);

		const payload = ProjectCreateProps.safeParse({
			...values,
			userId: userId!,
		});

		if (!payload.success) {
			toast({
				title: "Please Provide Correct Data",
				description:
					"Invalid Details for the project Provided, please change them",
				variant: "destructive",
			});
			return;
		}

		const res = await api.post("/projects/create", payload.data);
		if (res.status == 201) {
			toast({
				title: `Project ${res.data.name} Created!`,
				description: `Project ${res.data.name} with Display Name ${res.data.displayName} was created successfully!`,
			});
		} else
			toast({
				title: "Some Error Occurred!",
				description: "Uh Oh! Some problem Occurred while creating the project",
			});

		setIsLoading(false);
		form.reset();
		setOpen(false);
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className={cn(
					"group shadow-sm hover:shadow-lg duration-300",
					buttonVariants({
						variant: "default",
						size: window.screen.width <= 640 ? "sm" : "default",
					})
				)}
			>
				<PlusIcon className="w-4 mr-2" /> Create Project
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>Create a new project</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Acme" {...field} />
									</FormControl>
									<FormDescription className="text-sm">
										This is your display name on the dashboard.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormControl>
										<Input placeholder="ACME.INC" {...field} />
									</FormControl>
									<FormDescription className="text-sm">
										This is your display name on the card.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="displayUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Url</FormLabel>
									<FormControl>
										<Input placeholder="acme.com" {...field} />
									</FormControl>
									<FormDescription className="text-sm">
										This is your display url on the card.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-1">
							<Button
								variant={"secondary"}
								type="reset"
								onClick={() => {
									setOpen(false);
									form.reset();
								}}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading && (
									<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
								)}
								{isLoading ? "Please Wait" : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
