"use client";

import { Project } from "@prisma/client";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogCancel,
} from "./ui/alert-dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ShadowNoneIcon } from "@radix-ui/react-icons";

import { api } from "@/lib/axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const ProjectDeleteConfirmationForm: React.FC<{
	project: Project;
}> = ({ project }) => {
	const [open, setOpen] = useState(false);

	const formSchema = z.object({
		name: z.literal(project.name),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const { toast } = useToast();
	const router = useRouter();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const res = await api.delete(`/projects/${project.id}/delete`);

		if (res.status === 204) {
			toast({
				title: "Project Deleted",
				description: "The project was deleted successfully!",
			});
		} else
			toast({
				variant: "destructive",
				title: "Some Error Occurred!",
				description: "Uh Oh! Some problem Occurred while deleting the project",
			});

		setOpen(false);
		router.push("/dashboard");
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={() => {
				setOpen(!open);
				form.reset();
			}}
			defaultOpen={false}
		>
			<AlertDialogTrigger
				className={cn(
					"hover:shadow-md duration-300",
					buttonVariants({ variant: "destructive" })
				)}
			>
				Delete
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Project</AlertDialogTitle>
					<AlertDialogDescription>
						Please note that this action is irreversible as the project and its
						members & id card will be permanently deleted from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type the project name to confirm.</FormLabel>
									<FormControl>
										<Input placeholder={project.name} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<AlertDialogFooter>
							<AlertDialogCancel
								type="reset"
								className={buttonVariants({ variant: "ghost" })}
							>
								Cancel
							</AlertDialogCancel>
							<Button
								type="submit"
								disabled={
									form.formState.isSubmitting || !form.formState.isValid
								}
							>
								{form.formState.isSubmitting && (
									<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
								)}
								{form.formState.isSubmitting ? "Please Wait" : "Confirm"}
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
};
