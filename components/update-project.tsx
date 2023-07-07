"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Project } from "@prisma/client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { ProjectUpdateProps } from "@/lib/validators";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import { ShadowNoneIcon } from "@radix-ui/react-icons";
import { CardFooter } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
	name: z.string().min(3),
	displayName: z.string().min(3),
	displayUrl: z.string().optional(),
});

export const UpdateProjectForm: React.FC<{ project: Project }> = ({
	project,
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: project.name,
			displayName: project.displayName,
			displayUrl: project.displayUrl ? project.displayUrl : undefined,
		},
	});

	const { toast } = useToast();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const parsedPayload = ProjectUpdateProps.safeParse(values);

			if (!parsedPayload.success) {
				toast({
					title: "Some Error Occurred!",
					description:
						"Uh Oh! Some problem Occurred while creating the project",
					variant: "destructive",
				});
				form.reset();
				return;
			}

			const res = await api.put(`/projects/${project.id}`, values);

			if (res.status == 200)
				toast({
					title: "Project Updated Successfully!",
					description: `Project, "${values.name}" updated successfully!`,
				});
			else
				toast({
					title: "Some Error Occurred!",
					description:
						"Uh Oh! Some problem Occurred while creating the project",
					variant: "destructive",
				});
		} catch (error) {
			console.error("PROJECT UPDATE ERROR: ", error);
			toast({
				title: "Some Error Occurred!",
				description: "Uh Oh! Some problem Occurred while creating the project",
				variant: "destructive",
			});
		} finally {
			form.reset();
			// TODO: Invalidate query here instead.
			window.location.reload();
		}
	};

	return (
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

				<CardFooter className="justify-end gap-2">
					<Button
						type="reset"
						onClick={() => form.reset()}
						disabled={!form.formState.isDirty}
						variant={"secondary"}
					>
						Reset
					</Button>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
					>
						{form.formState.isSubmitting && (
							<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
						)}
						{form.formState.isSubmitting ? "Please Wait" : "Save"}
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
};
