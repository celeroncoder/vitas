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

import { Member, Project } from "@prisma/client";

import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

const DEFAULT_MEMBER_EMAIL = "user@example.com";

const formSchema = z.object({
	name: z.string().min(1),
	username: z.string().min(1),
	position: z.string().min(1),
	email: z.string().default(DEFAULT_MEMBER_EMAIL),
});

export const AddMemberForm: React.FC<{ project: Project }> = ({
	project: initialProjectData,
}) => {
	const { data: project } = useQuery<Project>({
		queryKey: ["project", initialProjectData.id],
		async queryFn() {
			const res = await api.get(`/projects/${initialProjectData.id}`);
			return res.data;
		},
		initialData: initialProjectData,
	});

	const [open, setOpen] = useState(false);

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

	const { mutateAsync } = useMutation<Member, any, MemberCreateProps>({
		async mutationFn(props) {
			const res = await api.post("/members", props);
			return res.data;
		},
		onSuccess() {
			queryClient.invalidateQueries(["members", project.id]);
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
			const res = await mutateAsync(payload.data);

			if (res) {
				toast({
					title: `Member @${res.username} Added!`,
					description: `${res.name} was added successfully!`,
				});
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

		setOpen(false);
		form.reset();
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
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting && (
									<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
								)}
								{form.formState.isSubmitting ? "Please Wait" : "Add"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
