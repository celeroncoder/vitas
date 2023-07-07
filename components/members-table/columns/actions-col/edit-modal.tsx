"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShadowNoneIcon } from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

import { MemberUpdateProps } from "@/lib/validators";
import { Member } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const DEFAULT_MEMBER_EMAIL = "user@example.com";

const formSchema = z.object({
	name: z.string().min(1),
	username: z.string().min(1),
	position: z.string().min(1),
	email: z.string().default(DEFAULT_MEMBER_EMAIL),
});

export const EditModalForm: React.FC<{
	member: Member;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ member, open, setOpen }) => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: member.name,
			username: member.username,
			position: member.position,
			email: member.email || DEFAULT_MEMBER_EMAIL,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const processEmail = () => {
			if (values.email == DEFAULT_MEMBER_EMAIL) return null;

			const parsedEmail = z.string().email().safeParse(values.email);

			if (!parsedEmail.success) return null;

			return parsedEmail.data;
		};

		const payload = MemberUpdateProps.safeParse({
			...values,
			email: processEmail(),
		});

		if (!payload.success) {
			toast({
				title: "Uh Oh!",
				description:
					"Please check the form again, there seems to be some error.",
				variant: "destructive",
			});
			form.reset();
			setOpen(false);
			return;
		}

		try {
			const res = await api.put(`/members/${member.id}`, payload.data);

			if (res.status === 200) {
				// show done notification
				toast({
					title: "Member Updated",
					description: `Member, "${member.name}" updated successfully!`,
				});
			} else {
				toast({
					title: "Uh Oh!",
					description:
						"There was some problem updating the member, Please try again after some time.",
					variant: "destructive",
				});
			}
		} catch (err) {
			toast({
				title: "Uh Oh!",
				description:
					"There was some problem updating the member, Please try again after some time.",
				variant: "destructive",
			});
		} finally {
			form.reset();
			router.refresh();
			setOpen(false);
			// TODO: replace this and invalidate the memeber-data-table data.
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Member</DialogTitle>
					<DialogDescription>
						Make changes to the member here. Click save when you're done.
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

						<DialogFooter>
							<Button
								size="sm"
								variant={"secondary"}
								onClick={() => {
									setOpen(false);
									form.reset();
								}}
								type="reset"
							>
								Cancel
							</Button>
							<Button
								size="sm"
								disabled={form.formState.isSubmitting}
								type="submit"
							>
								{form.formState.isSubmitting && (
									<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
								)}
								{form.formState.isSubmitting ? "Please Wait" : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
