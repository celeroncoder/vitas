"use client";

import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { MemberCreateProps } from "@/lib/validators";
import { ShadowNoneIcon, PlusIcon } from "@radix-ui/react-icons";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Project } from "@prisma/client";

import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DEFAULT_MEMBER_EMAIL = "user@example.com";

const formSchema = z.object({
	name: z.string().min(1),
	username: z.string().min(1),
	position: z.string().min(1),
	email: z.string().default(DEFAULT_MEMBER_EMAIL),
});

export const AddMemberForm: React.FC<{ project: Project }> = ({ project }) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			username: "",
			position: "",
			email: "",
		},
	});

	const { toast } = useToast();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);

		const processEmail = () => {
			if (values.email == DEFAULT_MEMBER_EMAIL) return null;

			const parsedEmail = z.string().email().safeParse(values.email);

			if (!parsedEmail.success) return null;

			return parsedEmail.data;
		};

		const payload = MemberCreateProps.safeParse({
			...values,
			email: processEmail(),
			projectId: project.id,
		});

		if (payload.success) {
			const res = await api.post("/members/create", payload.data);

			if (res.status == 201) {
				toast({
					title: `Member @${res.data.username} Added!`,
					description: `${res.data.name} was added successfully!`,
				});
				setOpen(false);

				// TODO: replace this to invalidate or refetch the data-table data.
				router.refresh();
			} else
				toast({
					title: "Some Error Occurred!",
					description: "Uh Oh! Some problem Occurred while adding the member",
				});
		} else {
			toast({
				title: "Please Provide Correct Data",
				description:
					"Invalid Details for the member provided, please change them. The form has been reset fill it with correct details.",
			});
		}

		form.reset();
		setIsLoading(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className={cn(
					"group shadow-sm hover:shadow-lg duration-300",
					buttonVariants({
						variant: "outline",
						size: window.screen.width <= 640 ? "sm" : "default",
					})
				)}
			>
				<PlusIcon className="w-4 mr-2" /> Add Member
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Member</DialogTitle>
					<DialogDescription>
						Add a new member to {project.name}
					</DialogDescription>
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
										<Input placeholder="Khushal Bhardwaj" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="celeroncoder" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Position</FormLabel>
									<FormControl>
										<Input placeholder="Founder & CEO" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="me@example.com" {...field} />
									</FormControl>
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
								{isLoading ? "Please Wait" : "Add"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
