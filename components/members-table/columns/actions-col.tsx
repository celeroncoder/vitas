import { Member } from "@prisma/client";
import { Row } from "@tanstack/react-table";

import { Copy, Edit, Loader2, Mail, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { api } from "@/lib/axios";
import { useState } from "react";
import { useToast } from "../../ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { MemberUpdateProps } from "@/lib/validators";

export const ActionsCol: React.FC<{ row: Row<Member> }> = ({ row }) => {
  // TODO: use this to copy the digital id image url
  const member = row.original;

  const router = useRouter();
  const { toast } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

  const sendEmail = async () => {
    try {
      const res = await api.post(`/members/${member.id.toString()}/email`);

      if (res.status == 200)
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
  };

  const deleteMember = async () => {
    setDeleteBtnLoading(true);
    const res = await api.delete(`/members/${member.id}/delete`);

    if (res.status === 204) {
      // show done notification
      toast({
        title: "Member Deleted",
        description: `Member, "${member.name}" removed form the project, successfully!`,
      });

      // TODO: replace this and invalidate the memeber-data-table data.
      router.refresh();
    } else {
      toast({
        title: "Uh Oh!",
        description:
          "There was some problem deleting the member, Please try again after some time.",
        variant: "destructive",
      });
    }

    // closeup
    setDeleteBtnLoading(false);
    setDeleteModalOpen(false);
  };

  const EditConfirmationModal = () => {
    const [name, setName] = useState(member.name);
    const [username, setUsername] = useState(member.username);
    const [position, setPosition] = useState(member.position);
    const [updateBtnLoading, setUpdateBtnLoading] = useState(false);

    const save = async () => {
      setUpdateBtnLoading(true);
      const payload: z.infer<typeof MemberUpdateProps> = {
        name,
        position,
        username,
      };
      const res = await api.put(`/members/${member.id}/update`, payload);

      if (res.status === 200) {
        // show done notification
        toast({
          title: "Member Updated",
          description: `Member, "${member.name}" updated successfully!`,
        });

        // TODO: replace this and invalidate the memeber-data-table data.
        router.refresh();
      } else {
        toast({
          title: "Uh Oh!",
          description:
            "There was some problem updating the member, Please try again after some time.",
          variant: "destructive",
        });
      }

      setUpdateBtnLoading(false);
      setEditModalOpen(false);
    };

    return (
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Make changes to the member here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Position</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant={"secondary"}
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" disabled={updateBtnLoading} onClick={save}>
              {updateBtnLoading && (
                <Loader2 className="mr-2 w-4 animate-spin" />
              )}
              {updateBtnLoading ? "Please Wait" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const DeleteConfirmationModal = () => (
    <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            member from the project, and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={deleteBtnLoading} onClick={deleteMember}>
            {deleteBtnLoading && <Loader2 className="mr-2 w-4 animate-spin" />}
            {deleteBtnLoading ? "Please Wait" : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText("#")}>
            <Copy className="w-3 mr-2" /> Copy URL
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!member.email} onClick={sendEmail}>
            <Mail className="mr-2 w-3" /> Deliever
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
            <Edit className="w-3 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteModalOpen(true)}
            className="text-red-500"
          >
            <Trash className="w-3 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditConfirmationModal />
      <DeleteConfirmationModal />
    </>
  );
};
