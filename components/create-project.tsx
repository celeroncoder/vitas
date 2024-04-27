"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShadowNoneIcon, PlusIcon } from "@radix-ui/react-icons";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { ProjectCreateProps } from "@/lib/validators";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Project } from "@prisma/client";
import { queryClient } from "@/lib/react-query";

const formSchema = z.object({
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().min(3).optional(),
});

export const CreateProjectForm = () => {
  const [open, setOpen] = useState(false);

  const { userId } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      displayName: "",
      displayUrl: "",
    },
  });

  const { mutateAsync } = useMutation<Project, any, ProjectCreateProps>({
    mutationFn: async (props) => {
      const res = await api.post("/projects", props);
      return res.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = ProjectCreateProps.safeParse({
      ...values,
      userId: userId!,
    });

    if (!payload.success) {
      toast({
        title: "Please Provide Correct Data",
        description:
          "Invalid Details for the event Provided, please change them",
        variant: "destructive",
      });
      return;
    }

    const res = await mutateAsync(payload.data);
    if (res) {
      toast({
        title: `Event ${res.name} Created!`,
        description: `Event ${res.name} with Display Name ${res.displayName} was created successfully!`,
      });
    } else
      toast({
        title: "Some Error Occurred!",
        description: "Uh Oh! Some problem Occurred while creating the Event.",
      });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "group shadow-sm hover:shadow-lg duration-300",
          buttonVariants({
            variant: "default",
            size: window.screen.width <= 640 ? "sm" : "default",
          })
        )}
      >
        <PlusIcon className="w-4 mr-2" /> Create Event
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Create a new Event</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme" {...field} />
                  </FormControl>
                  <FormDescription className="text-sm">
                    This is your display name on the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ACME.INC" {...field} />
                  </FormControl>
                  <FormDescription className="text-sm">
                    This is your display name on the card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Link</FormLabel>
                  <FormControl>
                    <Input placeholder="acme.com" {...field} />
                  </FormControl>
                  <FormDescription className="text-sm">
                    This is your Registration Link for participants.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-1 gap-y-2">
              <Button
                variant={"secondary"}
                type="reset"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <ShadowNoneIcon className="mr-2 w-3 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Please Wait" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
