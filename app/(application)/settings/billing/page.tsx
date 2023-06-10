import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { redirect } from "next/navigation";

export default async function BillingSettingsPage() {
  const [account, user] = await service.account.get();

  if (!user) redirect("/sign-in");
  if (!account) redirect("/sign-up");

  return (
    <>
      <div className="mb-4">
        <Title className="text-3xl">Billing Settings</Title>
        <p className="text-muted-foreground">Manage your subscriptions</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            {account.isPremium ? (
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
            The premium plan gives you access to all the features of the app,
            with no limits. You have unlimited access to all the features of the
            application.
          </p>
        </CardContent>
        <CardFooter>
          <Button>
            {account.isPremium ? "Manage Subscription" : "Upgrade to Premium"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
