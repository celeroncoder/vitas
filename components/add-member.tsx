"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { MemeberCreateProps } from "@/lib/validators";
import { api } from "@/lib/axios";
import { useToast } from "./ui/use-toast";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@prisma/client";
import z from "zod";
import { useRouter } from "next/navigation";

export const AddMember: React.FC<{ project: Project }> = ({ project }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [position, setPosition] = useState("");

  const reset = () => {
    setName("");
    setUsername("");
    setPosition("");
  };

  const { toast } = useToast();

  const add = async () => {
    setIsLoading(true);
    const member: z.infer<typeof MemeberCreateProps> = {
      name,
      username,
      position,
      projectId: project.id,
    };
    const payload = MemeberCreateProps.safeParse(member);

    if (payload.success) {
      const res = await api.post("/members/create", payload.data);

      if (res.status == 201) {
        reset();
        toast({
          title: `Member @${res.data.username} Added!`,
          description: `${res.data.name} was added successfully!`,
        });
        setOpen(false);

        // TODO: replace this to invalidate or refetch the data-table data.
        router.refresh();
      } else
        toast({
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while adding the member",
        });
    } else {
      toast({
        title: "Please Provide Correct Data",
        description:
          "Invalid Details for the member provided, please change them.",
      });
    }

    setIsLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          "group shadow-sm hover:shadow-lg duration-300",
          buttonVariants({
            variant: "default",
            size: window.screen.width <= 640 ? "sm" : "default",
          })
        )}
      >
        <Plus className="w-4 mr-2" /> Add Member
      </SheetTrigger>
      <SheetContent size={window.screen.width <= 640 ? "full" : "lg"}>
        <SheetHeader>
          <SheetTitle>Add Member</SheetTitle>
          <SheetDescription>
            Add a new member to {project.name}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1">
            <Label className="">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=""
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=""
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="">Position</Label>
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className=""
            />
          </div>

          <SheetFooter className="gap-1">
            <Button variant={"secondary"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Please Wait" : "Add"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
