"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Project } from "@prisma/client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { ProjectUpdateProps } from "@/lib/validators";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import { CalendarIcon, ShadowNoneIcon } from "@radix-ui/react-icons";
import { CardFooter } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import superjson from "superjson";

const formSchema = z.object({
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),

  // bannerImageUrl: z.string().optional(),
  from: z.date().optional(),
  to: z.date().optional(),
  fee: z.number().optional(),
});

export const UpdateProjectForm: React.FC<{ project: Project }> = ({
  project: initialProjectData,
}) => {
  const { data: project } = useQuery<Project>({
    queryKey: ["project", initialProjectData.id],
    async queryFn() {
      const res = await api.get(`/projects/${initialProjectData.id}`);
      return res.data;
    },
    initialData: initialProjectData,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      displayName: project.displayName,
      displayUrl: project.displayUrl ? project.displayUrl : undefined,
      fee: project.fee || 0,
      from: project.from || undefined,
      to: project.to || undefined,
    },
  });

  const { toast } = useToast();

  const { mutateAsync } = useMutation<Project, any, ProjectUpdateProps>({
    async mutationFn(props) {
      const res = await api.put(`/projects/${project.id}`, props);
      return res.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset({
        displayName: data.displayName,
        name: data.name,
        displayUrl: data.displayUrl || undefined,
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const parsedPayload = ProjectUpdateProps.safeParse(values);

      if (!parsedPayload.success) {
        toast({
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while creating the Event",
          variant: "destructive",
        });
        form.reset();
        return;
      }

      const res = await mutateAsync(parsedPayload.data);

      if (res)
        toast({
          title: "Event Updated Successfully!",
          description: `Event, "${res.name}" updated successfully!`,
        });
      else
        toast({
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while creating the Event",
          variant: "destructive",
        });
    } catch (error) {
      console.error("Event UPDATE ERROR: ", error);
      toast({
        title: "Some Error Occurred!",
        description: "Uh Oh! Some problem Occurred while creating the Event",
        variant: "destructive",
      });
    }
  };

  return (
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

        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Fees</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Rs. 400"
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                  value={field.value === null ? 0 : field.value}
                />
              </FormControl>
              <FormDescription className="text-sm">
                This is the registration fees that will show up on the
                participants registration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-start gap-4 pt-4">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>From</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The starting date of the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The ending date of the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CardFooter className="justify-end gap-2">
          <Button
            type="reset"
            onClick={() => form.reset()}
            disabled={!form.formState.isDirty}
            variant={"secondary"}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting && (
              <ShadowNoneIcon className="mr-2 w-3 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Please Wait" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
