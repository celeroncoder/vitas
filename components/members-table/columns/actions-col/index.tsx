import {
	CopyIcon,
	Pencil1Icon,
	EnvelopeClosedIcon,
	DotsVerticalIcon,
	TrashIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditModalForm } from "./edit-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { DelieverEmailConfirmationModal } from "./deliever-email-confirmation-modal";

import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

import { Member } from "@prisma/client";
import { Row } from "@tanstack/react-table";

export const ActionsCol: React.FC<{ row: Row<Member> }> = ({ row }) => {
	const member = row.original;

	const { toast } = useToast();

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [emailDelieverModalOpen, setEmailDelieverModalOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<DotsVerticalIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => navigator.clipboard.writeText("#")}>
						<CopyIcon className="w-3 mr-2" /> Copy URL
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={!member.email}
						onClick={() => setEmailDelieverModalOpen(true)}
					>
						<EnvelopeClosedIcon className="mr-2 w-3" /> Deliever
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setEditModalOpen(true)}>
						<Pencil1Icon className="w-3 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setDeleteModalOpen(true)}
						className="text-red-500"
					>
						<TrashIcon className="w-3 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Modals */}
			<EditModalForm
				member={member}
				open={editModalOpen}
				setOpen={setEditModalOpen}
			/>
			<DeleteConfirmationModal
				member={member}
				open={deleteModalOpen}
				setOpen={setDeleteModalOpen}
			/>
			<DelieverEmailConfirmationModal
				member={member}
				open={emailDelieverModalOpen}
				setOpen={setEmailDelieverModalOpen}
			/>
		</>
	);
};
