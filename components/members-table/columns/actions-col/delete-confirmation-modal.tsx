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
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export const DeleteConfirmationModal: React.FC<{
  member: Member;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ member, open, setOpen }) => {
  const { id } = useParams();
  const { toast } = useToast();

  const [btnLoading, setBtnLoading] = useState(false);

  const { mutateAsync } = useMutation<boolean>({
    async mutationFn() {
      const res = await api.delete(`/members/${member.id}`);

      return res.status === 200;
    },
    onSuccess() {
      queryClient.invalidateQueries(["members", id]);
    },
  });

  const deleteMember = async () => {
    setBtnLoading(true);
    const res = await mutateAsync();

    if (res) {
      // show done notification
      toast({
        title: "Member Deleted",
        description: `Member, "${member.name}" removed form the project, successfully!`,
      });
    } else {
      toast({
        title: "Uh Oh!",
        description:
          "There was some problem deleting the member, Please try again after some time.",
        variant: "destructive",
      });
    }

    // closeup
    setBtnLoading(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            participant from the Event, and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={btnLoading} onClick={deleteMember}>
            {btnLoading && <ShadowNoneIcon className="mr-2 w-3 animate-spin" />}
            {btnLoading ? "Please Wait" : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
