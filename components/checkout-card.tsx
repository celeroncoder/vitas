"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/axios";
import {
  StripeChecoutSessionCreateProps,
  StripeChecoutSessionCreateResult,
} from "@/lib/validators";
import { Account } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export const CheckoutCard: React.FC<{
  account: Account;
  isSubscribed: boolean;
  isCanceled: boolean;
}> = ({ account, isSubscribed, isCanceled }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  if (!user) return <p>Loading...</p>;

  const action = async () => {
    const payload: StripeChecoutSessionCreateProps = {
      accountId: account.id,
      email: user?.emailAddresses[0].emailAddress!,
    };
    const res = await api.post("/stripe/checkout", payload);
    if ((res.status = 201)) {
      const parsedData = StripeChecoutSessionCreateResult.safeParse(res.data);

      if (parsedData.success) {
        const url = parsedData.data.url;
        router.push(url, { forceOptimisticNavigation: true });
      } else
        toast({
          title: "Some Error Occured",
          description: "Please try again later",
          variant: "destructive",
        });
    } else
      toast({
        title: "Some Error Occured",
        description: "Please try again later",
        variant: "destructive",
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          {isSubscribed ? (
            <p>
              You are currently on <strong>Premium Plan</strong>
            </p>
          ) : (
            "Get Premium"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          The premium plan gives you access to all the features of the app, with
          no limits. You have unlimited access to all the features of the
          application.
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between flex-wrap">
        <Button onClick={action}>
          {isSubscribed ? "Manage Subscription" : "Upgrade to Premium"}
        </Button>
        {isSubscribed && (
          <p className="text-sm text-muted-foreground">
            {isCanceled
              ? "You plan will be cancelled on "
              : "Your plan renews on "}

            <strong>
              {account.stripeCurrentPeriodEnd!.toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
