"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShadowNoneIcon } from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { AccountCreateProps } from "@/lib/validators";

const formSchema = z.object({
  termsAndPolicyAccepted: z.boolean().refine((v) => v === true),
});

export const CreateAccountForm: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termsAndPolicyAccepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: AccountCreateProps = {
        id,
      };

      const res = await api.post("/account", payload);

      if (res.status !== 201)
        toast({
          title: "Something went wrong. Please try again.",
          variant: "destructive",
        });

      toast({ title: "Account created successfully." });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          This will create your account in VITAS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="termsAndPolicyAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "termsAndPolicyAccepted",
                          checked.valueOf() as boolean
                        )
                      }
                    />
                  </FormControl>
                  <div className="leading-none space-y-2">
                    <div className="space-y-1">
                      <FormLabel>Accept Terms & Policies</FormLabel>
                      <FormDescription>
                        I agree to the terms and policy of VITAS.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <CardFooter className="flex items-center justify-end px-0">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <ShadowNoneIcon className="mr-2 w-3 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Please Wait" : "Create"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
