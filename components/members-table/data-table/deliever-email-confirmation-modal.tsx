"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShadowNoneIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export const DelieverEmailConfirmationModal: React.FC<{
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
	const params = useParams();
	const { toast } = useToast();

	const [btnLoading, setBtnLoading] = useState(false);

	const { mutateAsync } = useMutation<{ count: number }>({
		async mutationFn() {
			const res = await api.post(`/projects/${params?.id.toString()}/email`);

			return { count: res.data.count };
		},
	});

	const sendEmail = async () => {
		setBtnLoading(true);
		try {
			const res = await mutateAsync();

			if (res)
				toast({
					title: `(${res.count}) Emails Sent`,
					description: `The Digital Cards were successfully deliverd to ${res.count} members.`,
				});
		} catch (error) {
			console.error(error);
			toast({
				title: "Uh Oh! There was a problem sending the emails!",
				variant: "destructive",
			});
		}

		setBtnLoading(false);
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger className={buttonVariants({ variant: "secondary" })}>
				<EnvelopeClosedIcon className="w-4 mr-2" />
				Deliever
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Send ID Card</AlertDialogTitle>
					<AlertDialogDescription>
						This will send ID Card's custom URL to all members with an email
						address.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button disabled={btnLoading || !params} onClick={sendEmail}>
						{btnLoading && <ShadowNoneIcon className="mr-2 w-3 animate-spin" />}
						{btnLoading ? "Please Wait" : "Continue"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
