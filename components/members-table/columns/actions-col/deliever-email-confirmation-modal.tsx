"use client";

import { Member } from "@prisma/client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ShadowNoneIcon } from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export const DelieverEmailConfirmationModal: React.FC<{
	member: Member;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ member, open, setOpen }) => {
	const { toast } = useToast();

	const [btnLoading, setBtnLoading] = useState(false);

	const { mutateAsync } = useMutation<boolean>({
		async mutationFn() {
			const res = await api.post(`/members/${member.id.toString()}/email`);

			return res.status == 200;
		},
	});

	const sendEmail = async () => {
		setBtnLoading(true);
		try {
			const res = await mutateAsync();

			if (res)
				toast({
					title: "Email Sent",
					description: `The Digital Card was successfully deliverd to ${member.name}'s email address.`,
				});
		} catch (error) {
			console.error(error);
			toast({
				title: "Uh Oh! There was a problem sending the email!",
				variant: "destructive",
			});
		}

		setBtnLoading(false);
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Send ID Card</AlertDialogTitle>
					<AlertDialogDescription>
						This will send ID Card's custom URL to{" "}
						<strong>{member.name}</strong>'s email address i.e.{" "}
						<i>{member.email?.toString().toLowerCase()}</i>. They will shortly
						receive the mail.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button disabled={btnLoading} onClick={sendEmail}>
						{btnLoading && <ShadowNoneIcon className="mr-2 w-3 animate-spin" />}
						{btnLoading ? "Please Wait" : "Continue"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
