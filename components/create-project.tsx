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
import { useAuth } from "@clerk/nextjs";
import { Button, buttonVariants } from "./ui/button";
import { ProjectCreateProps } from "@/lib/validators";
import { api } from "@/lib/axios";
import { useToast } from "./ui/use-toast";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const CreateProject = () => {
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");

  const reset = () => {
    setName("");
    setDisplayName("");
    setDisplayUrl("");
  };

  const { toast } = useToast();

  const create = async () => {
    const payload = ProjectCreateProps.safeParse({
      name,
      displayName,
      displayUrl,
      userId: userId!,
    });

    if (payload.success) {
      const res = await api.post("/projects/create", payload.data);
      if (res.status == 201) {
        reset();
        toast({
          title: `Project ${res.data.name} Created!`,
          description: `Project ${res.data.name} with Display Name ${res.data.displayName} was created successfully!`,
        });
        setOpen(false);
      } else
        toast({
          title: "Some Error Occurred!",
          description:
            "Uh Oh! Some problem Occurred while creating the project",
        });
    } else {
      console.log({
        title: "Please Provide Correct Data",
        description:
          "Invalid Details for the project Provided, please change them",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          "group shadow-sm hover:shadow-lg duration-300",
          buttonVariants({ variant: "default" })
        )}
      >
        <Plus className="w-4 mr-2" /> Create Project
      </SheetTrigger>
      <SheetContent size={"full"}>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>Create a new project</SheetDescription>
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
            <Label className="">Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className=""
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="">Display URL</Label>
            <Input
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              className=""
            />
          </div>

          <SheetFooter className="gap-1">
            <Button variant={"secondary"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create}>Create</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
