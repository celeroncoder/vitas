"use client";

import { Project } from "@prisma/client";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
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
import { ShadowNoneIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export const ProjectDeleteConfirmation: React.FC<{
	project: Project;
	triggerClassName?: string;
}> = ({ project, triggerClassName }) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState<string>();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (name === project.name) setIsConfirmed(true);
		else setIsConfirmed(false);
	});

	const onOpenChange = (open: boolean) => {
		setName(undefined);
		setOpen(open);
	};

	const { toast } = useToast();
	const router = useRouter();

	const deleteProject = async () => {
		setIsLoading(true);

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

		setIsLoading(false);
		onOpenChange(false);
		router.push("/dashboard");
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<AlertDialogTrigger className={triggerClassName}>
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
				<div className="flex flex-col gap-2">
					<Label>
						Please enter project name, i.e.{" "}
						<span className="font-semibold">"{project.name}"</span> to confirm.
					</Label>
					<Input
						placeholder="(e.g.: 'techtrix')"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => setOpen(false)}
						autoFocus
						className={buttonVariants({ variant: "ghost" })}
					>
						Cancel
					</AlertDialogCancel>
					<Button onClick={deleteProject} disabled={isLoading || !isConfirmed}>
						{isLoading && <ShadowNoneIcon className="mr-2 w-3 animate-spin" />}
						{isLoading ? "Please Wait" : "Confirm"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
