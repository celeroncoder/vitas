"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MemberUpdateProps } from "@/lib/validators";
import { Member } from "@prisma/client";
import { Loader2 } from "lucide-react";

export const EditModal: React.FC<{
  member: Member;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ member, open, setOpen }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(member.name);
  const [username, setUsername] = useState(member.username);
  const [position, setPosition] = useState(member.position);
  const [btnLoading, setBtnLoading] = useState(false);

  const save = async () => {
    setBtnLoading(true);
    const payload: MemberUpdateProps = {
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

    setBtnLoading(false);
    setOpen(false);
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
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={btnLoading} onClick={save}>
            {btnLoading && <Loader2 className="mr-2 w-4 animate-spin" />}
            {btnLoading ? "Please Wait" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
