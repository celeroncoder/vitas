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

import { MemberDeleteManyProps } from "@/lib/validators";
import { Member } from "@prisma/client";

import { useState } from "react";
import { z } from "zod";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShadowNoneIcon, TrashIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export type DeleteConfirmationModalProps<TData> = {
	selectedRows: TData[];
	setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
	deleteSelectionDisabled: boolean;
};

export function DeleteConfirmationModal<TData>({
	selectedRows,
	setRowSelection,
	deleteSelectionDisabled,
}: DeleteConfirmationModalProps<TData>) {
	const { id } = useParams();
	const { toast } = useToast();

	const [open, setOpen] = useState(false);
	const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

	const { mutateAsync } = useMutation<
		boolean,
		any,
		z.infer<typeof MemberDeleteManyProps>
	>({
		async mutationFn(payload) {
			const res = await api.post("/members/deleteMany", payload);

			return res.status === 200;
		},
		onSuccess() {
			queryClient.invalidateQueries(["members", id]);
		},
	});

	const deleteSelectedRows = async () => {
		setDeleteBtnLoading(true);
		const payload: z.infer<typeof MemberDeleteManyProps> = {
			ids: selectedRows.map((row) => (row as Member).id),
		};

		const res = await mutateAsync(payload);

		if (res) {
			toast({
				title: "Selected Members Deleted",
				description: "The selected Members were deleted successfully!",
			});
		} else
			toast({
				variant: "destructive",
				title: "Some Error Occurred!",
				description: "Uh Oh! Some problem Occurred while adding the member",
			});

		setDeleteBtnLoading(false);
		setOpen(false);
		setRowSelection({});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				disabled={deleteSelectionDisabled}
				className={cn(buttonVariants({ variant: "destructive" }), "ml-auto")}
			>
				<TrashIcon className="w-3 mr-2" />
				Delete
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						members from the project, and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button disabled={deleteBtnLoading} onClick={deleteSelectedRows}>
						{deleteBtnLoading && (
							<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
						)}
						{deleteBtnLoading ? "Please Wait" : "Continue"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
